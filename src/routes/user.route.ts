import { Router } from 'express';
import { deleteUser, getAllUsers, getUserById, registerUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', registerUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser)

export default router;