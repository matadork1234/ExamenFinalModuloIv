import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShoppingCart } from "./shopping-cart.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, unique: true, nullable: false })
    email: string;

    @Column('varchar', { length: 255, nullable: false })
    password: string;

    @Column('varchar', { length: 75, nullable: false })
    firstName: string;

    @Column('varchar', { length: 75, nullable: false })
    lastName: string; 

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(
        () => ShoppingCart,
        sp => sp.user
    )
    shoppingCars: ShoppingCart[];
}