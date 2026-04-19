import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'companies' })
@Index('idx_company_sector', ['sector'])
@Index('idx_company_sub_sector', ['subSector'])
@Index('idx_company_location', ['location'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 64 })
  phone!: string;

  @Column({ type: 'varchar', length: 128 })
  sector!: string;

  @Column({ type: 'varchar', length: 128 })
  subSector!: string;

  @Column({ type: 'varchar', length: 128 })
  location!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin?: string;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
