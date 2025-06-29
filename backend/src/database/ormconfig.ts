import { DataSourceOptions, DataSource } from "typeorm";
import * as dotenv from 'dotenv'

dotenv.config()
const isCompiled = __dirname.includes('dist');

export const dataSourceOptions: DataSourceOptions = {
    type:'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
    bigNumberStrings: true,
    multipleStatements: true,
    synchronize: true,
    logging: true,
    entities:  [isCompiled ? 'dist/entities/*.entity.js' : 'src/entities/*.entity.ts'],
    migrations: ['**/dist/database/migrations/*{.ts,.js}'],
    migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource