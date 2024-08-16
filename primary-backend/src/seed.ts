import {PrismaClient} from "@prisma/client";
const prismaClient = new PrismaClient();

async function main(){
    await prismaClient.availableTrigger.create({
        data: {
            id: "webhook",
            name: "webhook",
            image: "data:image/jpeg;base64,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"
        }

    })

    await prismaClient.availableAction.create({
        data:{
            id: "email",
            name: "Email",
            image: "data:image/jpeg;base64,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"
        }
    })
    await prismaClient.availableAction.create({
        data: {
            id: "sol",
            name: "Solana",
            image: "data:image/jpeg;base64,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"
        }
    })
}

main();