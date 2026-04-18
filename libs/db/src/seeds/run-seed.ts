import { DataSource } from 'typeorm';
import { seedCompanies } from './company.seed';
import { Company } from '../entities/company.entity';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Itsjefy7',
    database: 'company_search',
    entities: [Company],
    synchronize: false,
});

async function run() {
    try {
        await AppDataSource.initialize();
        console.log('📦 DB Connected');

        await seedCompanies(AppDataSource);

        await AppDataSource.destroy();
        console.log('🔌 DB Connection closed');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    }
}

run();