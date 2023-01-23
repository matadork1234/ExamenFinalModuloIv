import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DetailShopping } from "./detail-shopping.entity";
import { TStatus } from "./enum/status.enum";
import { User } from "./user.entity";

@Entity('shopping_carts')
export class ShoppingCart {
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column('integer', { name: 'invoice_number', default: 0, nullable: false })
    invoiceNumber: number;

    @Column('enum', { enum: TStatus, nullable: false })
    status: TStatus;

    @Column('float', { name: 'total_amount', default: 0, nullable: false })
    totalAmount: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'udapted_at', type: 'timestamptz', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(
        () => User,
        u => u.shoppingCars
    )
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

    @OneToMany(
        () => DetailShopping,
        dt => dt.shoppingCart,
    )
    detailsShopping!: DetailShopping[];
}