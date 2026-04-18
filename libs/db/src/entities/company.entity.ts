import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity({ name: 'companies' })
@Index(['sector'])
@Index(['subSector'])
@Index(['location'])
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    @Index()
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 50 })
    phone: string;

    @Column({ type: 'varchar', length: 100 })
    sector: string;

    @Column({ name: 'sub_sector', type: 'varchar', length: 100, nullable: true })
    subSector: string;

    @Column({ type: 'varchar', length: 100 })
    location: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    linkedin?: string;

    // PostgreSQL JSONB for flexible AI tags
    @Column({ type: 'jsonb', nullable: true })
    tags?: string[];

}