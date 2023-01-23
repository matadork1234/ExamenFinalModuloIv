import { Request, Response } from 'express';
import AppDataSource from '../config/database.config';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        var userData: User = await userRepository.findOne({
            where: {
                email
            }
        });

        if (!userData) {
            return res.status(401).json({ message: 'Credentials incorrect '});
        }

        if (!bcrypt.compareSync(password, userData.password)) {
            return res.status(401).json({ message: 'credentials incorrect' });
        } 
        
        var payload = {
            id: userData.id,
            email: userData.email
        };
        return res.status(200).json({
            user: userData,
            token: jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })});
        
    }
    catch (error) {
        res.status(404).json({ message: error });
    }

}

export const registerUser = async (req: Request, res: Response) => {
    try {
        var { email, password, firstName, lastName} = req.body;
        const user = userRepository.create({ email, password, firstName, lastName });
        password = bcrypt.hashSync(password, 10);
        var dataResult = await userRepository.save(user);

        var payload = {
            id: dataResult.id,
            email: dataResult.email
        }

        return res.status(200).json({
            user: dataResult,
            token: jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })})
        }

    catch (error) {
        res.status(404).json({ message: error });    
    }
}