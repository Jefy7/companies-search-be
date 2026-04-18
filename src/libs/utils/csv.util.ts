import { Readable } from 'node:stream';

import { Company } from '../db/entities/company.entity';

export const createCsvStream = (companies: AsyncIterable<Partial<Company>>): Readable => {
  const header = 'name,email,phone,sector,subSector,location,linkedin\n';
  async function* generator(): AsyncGenerator<string> {
    yield header;
    for await (const company of companies) {
      const row = [
        company.name,
        company.email,
        company.phone,
        company.sector,
        company.subSector,
        company.location,
        company.linkedin ?? '',
      ]
        .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
        .join(',');
      yield `${row}\n`;
    }
  }
  return Readable.from(generator());
};
