
import { Kafka } from 'kafkajs';
import {PrismaClient} from "@prisma/client"

const TOPIC_NAME = "zap-events"
const prismaClient = new PrismaClient();

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ['localhost:9092']
})

async function main(){
    const consumer = kafka.consumer({groupId: 'main-worker'})

    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({topic: TOPIC_NAME, fromBeginning: true})

    await consumer.run({
        autoCommit:false,
        eachMessage: async ({ topic, partition, message}) =>{
            
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
            const parsedValue = JSON.parse(message.value.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where:{
                    id: zapRunId
                },
                include:{
                    zap: {
                        include:{
                            actions:{
                                include:{
                                    type:true
                                }
                            }
                        }
                    }

                }
            })
            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

            if(!currentAction){
                console.log("Current Action not found");
                return
            }

            if( currentAction.type.id === "email"){
                console.log("sending email")
            }

            if(currentAction.type.id === "sol"){
                console.log("sending sol")
            }

            await new Promise(r => setTimeout(r, 1000));

            const zapId = message.value.toString();
            const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;

            if(lastStage !== stage){
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage +1,
                            zapRunId
                        })
                    }]
                    
                })
            }


            console.log("processing done..")

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset + 1)).toString()
        }])
        }
        
    })
    

}
main();