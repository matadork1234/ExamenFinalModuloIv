import e, { Request, Response } from "express";
import AppDataSource from '../config/database.config';
import { DetailShopping } from "../entities/detail-shopping.entity";
import { TStatus } from "../entities/enum/status.enum";
import { Product } from "../entities/product.entity";
import { ShoppingCart } from "../entities/shopping-cart.entity";
import { User } from "../entities/user.entity";

const shoppingCartRepository = AppDataSource.getRepository(ShoppingCart);
const detailShoppingRepository = AppDataSource.getRepository(DetailShopping);
const productRepository = AppDataSource.getRepository(Product);

export const AddProductCart = async (req: Request, res: Response) => {
    const { productId, price, quantity } = req.body;
    var invoiceNumber: number = 0;
    const user = req.user as User;

    var product = await productRepository.findOne({
        where: {
            id: productId
        }
    });

    const shoppingCartExists = await shoppingCartRepository.findOne({
        where: {
            user: {
                id: user.id
            },
            status: TStatus.PENDING
        }
    });

    
    
    
    if (!shoppingCartExists) {
        
        const generalShoppingCart = await shoppingCartRepository.find({
            order: {
                invoiceNumber: 'desc'
            },
            take: 1,
        });

    
        if (generalShoppingCart.length == 0) {
            invoiceNumber = 1
        } else {
            invoiceNumber = generalShoppingCart[0].invoiceNumber + 1;
        }

        var queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            var shoppingCart = new ShoppingCart();
            shoppingCart.status = TStatus.PENDING;
            shoppingCart.totalAmount = parseFloat(price);
            shoppingCart.user = user;
            shoppingCart.invoiceNumber = invoiceNumber;

            var newShoppingCart = await queryRunner.manager.save(ShoppingCart, shoppingCart);

            var detailShopping = new DetailShopping();
            detailShopping.shoppingCart = newShoppingCart;
            detailShopping.product = product;
            detailShopping.quantity = quantity;
            detailShopping.price = parseFloat(price);


            await queryRunner.manager.save(DetailShopping, detailShopping);

            await queryRunner.commitTransaction();

            return res.status(200).json({
                success: true,
                data: shoppingCart
            });
            
        } catch (error) {
            queryRunner.rollbackTransaction();
            return res.status(400).json({ success: false, message: error });
        } finally {
            await queryRunner.release();
        }

    } else {
        var queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect()
        await queryRunner.startTransaction();

        try {

            var existsProduct = await queryRunner.manager.findOne(DetailShopping, {
                where: {
                    product: {
                        id: product.id
                    },
                    shoppingCart: {
                        id: shoppingCartExists.id
                    }
                }
            });

            if (existsProduct) return res.status(400).json({ success: false, message: 'Product exist in the shopping cart, please selected other product' });


            var detailShopping = new DetailShopping();
            detailShopping.price = price;
            detailShopping.quantity = quantity;
            detailShopping.product = product;
            detailShopping.shoppingCart = shoppingCartExists;
    
            await queryRunner.manager.save(DetailShopping, detailShopping);
    
            shoppingCartExists.totalAmount = shoppingCartExists.totalAmount + price;
            await queryRunner.manager.save(ShoppingCart, shoppingCartExists);
            
            await queryRunner.commitTransaction();

            return res.status(200).json({ 
                success: true,
                data: shoppingCartExists 
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ success: false, message: error });
        } finally {
            await queryRunner.release();
        }

    }
}


export const deleteProductShopping = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = req.user as User;
    
    const shoppingCart = await shoppingCartRepository.findOne({
        where: {
            user: {
                id: user.id
            },
            status: TStatus.PENDING
        }
    });

    const product = await productRepository.findOneBy({ id });

    if (!shoppingCart) {
        return res.status(400).json({ success: false, message: 'Not exists a shopping cart' });
    } else {
        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const detailShoppingCart = await queryRunner.manager.findOne(DetailShopping, {
                where: {
                    shoppingCart: {
                        id: shoppingCart.id
                    },
                    product: {
                        id: product.id
                    }
                }
            });
    
            await queryRunner.manager.delete(DetailShopping, detailShoppingCart.id);

            shoppingCart.totalAmount = shoppingCart.totalAmount - detailShoppingCart.price;

            await queryRunner.manager.save(shoppingCart);

            await queryRunner.commitTransaction();
    
            return res.status(200).json({ success: true, data: shoppingCart });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ success: false, error: error });
        } finally {
            await queryRunner.release();
        }
    }
}

export const paymentShoppingCart = async (req: Request, res: Response) => {
    const user = req.user as User;
    
    const shoppingCart = await shoppingCartRepository.findOne({
        where: {
            user: {
                id: user.id
            },
            status: TStatus.PENDING
        }
    });

    if (!shoppingCart) {
        return res.status(404).json({ success: false, message: 'Not exist shopping cart' })
    }

    const detailShoppingCart = await detailShoppingRepository.find({
        where: {
            shoppingCart: {
                id: shoppingCart.id
            }
        }
    });

    if (detailShoppingCart.length == 0) {
        return res.status(404).json({ success: false, error: 'Not exists products, please add products' });
    }

    try {
        shoppingCart.status = TStatus.PAID;
        await shoppingCartRepository.save(shoppingCart);

        return res.status(200).json({ success: true, data: shoppingCart })
    } catch (error) {
        return res.status(404).json({ success: false, message: error })
    }
}