import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
    const allCards = await prisma.flashCard.findMany();
}

main().catch((e)=>{throw e}).finally(async() =>{await prisma.$disconnect();})
