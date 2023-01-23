import { join } from 'path';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    entities: [
        join(__dirname, '../**/*.entity{.ts,.js}')
    ],
    synchronize: true,
    logger: 'debug',
    logging: true
})

export default AppDataSource;