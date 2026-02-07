import { PrismaClient } from '@prisma/client'; // Adjust import path if using custom output
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // Ensure environment variables are loaded

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const connectDB = async () =>{
    try {
        await prisma.$connect();
        console.log("DB connected via Prisma");
        
    } catch (error) {
        console.error(`DB connect failed error: ${error.message}`);
    }
};

const disconnectDB = async () =>{
    await prisma.$disconnect();
}
export {prisma,connectDB,disconnectDB};
