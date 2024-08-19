
import { Kafka } from 'kafkajs';
import {PrismaClient} from "@prisma/client"
import { JsonObject } from '@prisma/client/runtime/library';
import {parse} from "./parser"

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
            const zapRunMetadata = zapRunDetails?.metadata;
            if( currentAction.type.id === "email"){
               
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
                console.log(`sending out email to ${to} and body is ${body}`)
                console.log("sending email");
                
            }

            if(currentAction.type.id === "sol"){
                
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                console.log(`sending out solana to ${address} and amount is ${amount}`)
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