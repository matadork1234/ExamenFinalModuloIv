import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ShoppingCart } from "./shopping-cart.entity";

@Entity('details_shopping')
export class DetailShopping {
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column('integer', { nullable: false, default: 0 })
    quantity: number;
    
    @Column('float', { nullable: false, default: 0 })
    price: number;

    @ManyToOne(
        () => Product,
        p => p.detailsShopping
    )
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: Product;

    @ManyToOne(
        () => ShoppingCart,
        sp => sp.detailsShopping,
        { nullable: false }
    )
    @JoinColumn({ name: 'shopping_cart_id', referencedColumnName: 'id' })
    shoppingCart!: ShoppingCart;
}