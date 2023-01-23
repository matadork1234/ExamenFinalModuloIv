import { Request, Response } from 'express';
import AppDataSource from '../config/database.config';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import validate from 'uuid-validate';

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await userRepository.find();

    return res.status(200).json(users);
}

export const getUserById = async (req: Request, res: Response ) => {
    const { id } = req.params;

    if (!validate(id)) return res.status(400).json({ message: 'Invalid, please insert a valid id' })

    const user = await userRepository.findOneBy({ id });

    if (!user) res.status(404).json({ message: 'User not exist' });

    return res.status(200).json(user);
}

export const registerUser = async (req: Request, res: Response) => {
    var { email, password, firstName, lastName } = req.body;
    password = bcrypt.hashSync(password, 10);

    try {
        const user = userRepository.create({ email, password, firstName, lastName });

        await userRepository.save(user);

        return res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    var { email, password, firstName, lastName } = req.body;

    if (!validate(id)) return res.status(400).json({ message: 'Invalid, please insert a valid id' })

    try {
        const userData = await userRepository.findOneBy({ id });

        if (!userData) return res.status(404).json({ message: 'User not found' })

        if (password) {
            if (!bcrypt.compareSync(password, userData.password)) {
                password = bcrypt.hashSync(password, 10);
            }    
        }        
        
        const user = await userRepository.preload({ id, email, password, firstName, lastName });


        await userRepository.save(user);

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validate(id)) return res.status(400).json({ message: 'Invalid, please insert a valid id' })

    try {
        const user = await userRepository.findOneBy({ id });
        if (!user) return res.status(404).json({ message: 'User not found '});

        await userRepository.delete(id);

        return res.status(200).json({ succees: true })
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}