import { DataSource } from 'typeorm';
import { Company } from '../entities/company.entity';

/**
 * Sector Mapping (Strongly Typed)
 */
const sectors = {
    Fintech: ['Payments', 'Lending', 'Trading'],
    Healthcare: ['Digital Health', 'Diagnostics'],
    SaaS: ['Cloud', 'CRM'],
    EdTech: ['E-learning', 'Training'],
    Gaming: ['Mobile', 'Online Games'],
    IoT: ['Smart Home', 'Industrial'],
    Logistics: ['Supply Chain', 'Fleet'],
    Cybersecurity: ['Network Security', 'Cloud Security'],
} as const;

type Sector = keyof typeof sectors;

/**
 * Locations
 */
const locations = [
    'London',
    'New York',
    'Bangalore',
    'San Francisco',
    'Berlin',
    'Singapore',
    'Dubai',
    'Sydney',
    'Tokyo',
    'Paris',
];

/**
 * Minimal Faker Type (avoid ESM import typing issues)
 */
type FakerType = {
    company: { name(): string };
    internet: { email(): string; domainWord(): string };
    phone: { number(): string };
    hacker: { noun(): string; verb(): string };
    helpers: { arrayElement<T>(arr: readonly T[]): T };
};

/**
 * Helper: Get valid sector + subSector
 */
function getRandomSector(faker: FakerType): { sector: Sector; subSector: string } {
    const sector = faker.helpers.arrayElement(Object.keys(sectors) as Sector[]);
    return {
        sector,
        subSector: faker.helpers.arrayElement(sectors[sector]),
    };
}

/**
 * Seed Function
 */
export const seedCompanies = async (dataSource: DataSource) => {
    // ✅ Dynamic import (CJS-safe)
    const fakerModule = await import('@faker-js/faker');
    const faker = fakerModule.faker as unknown as FakerType;

    const repo = dataSource.getRepository(Company);

    const companies: Partial<Company>[] = [];

    for (let i = 0; i < 1000; i++) {
        const { sector, subSector } = getRandomSector(faker);

        const company: Partial<Company> = {
            name: faker.company.name(),
            email: faker.internet.email().toLowerCase(),
            phone: faker.phone.number(),
            sector,
            subSector,
            location: faker.helpers.arrayElement(locations),
            linkedin: `https://linkedin.com/company/${faker.internet.domainWord()}`,
            tags: [faker.hacker.noun(), faker.hacker.verb()],
        };

        companies.push(company);

        if (i % 200 === 0) {
            console.log(`⏳ Prepared ${i} records`);
        }
    }

    console.log('🚀 Inserting companies...');

    await repo.insert(companies);

    console.log('✅ 1000 companies seeded successfully');
};