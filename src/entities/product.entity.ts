import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DetailShopping } from "./detail-shopping.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column('varchar', { length: 1500, nullable: false })
    name: string;

    @Column('float', { nullable: false, default: 0 })
    price: number;

    @Column('integer', { nullable: false, default: 0 })
    inventory: number;

    @Column('varchar',  { nullable: false, length: 150 })
    unit: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(
        () => DetailShopping,
        ds => ds.product
    )
    detailsShopping: DetailShopping[];
}