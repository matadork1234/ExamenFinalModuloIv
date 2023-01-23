import { Router } from 'express';
import { deleteProduct, getAllProducts, getProductById, registerProduct, updateProduct } from '../controllers/product.controller';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', registerProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;