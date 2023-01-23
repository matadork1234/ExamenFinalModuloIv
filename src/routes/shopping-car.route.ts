import { Router } from 'express';
import { AddProductCart, deleteProductShopping, paymentShoppingCart } from '../controllers/shopping-car.controller';

const router = Router();

router.post('/product', AddProductCart);
router.delete('/product/:id', deleteProductShopping);
router.post('/pay', paymentShoppingCart);

export default router;