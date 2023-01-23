import { Request, Response } from "express";
import AppDataSource from '../config/database.config';
import { Product } from '../entities/product.entity';

const productRepository = AppDataSource.getRepository(Product);

export const getAllProducts = async (req: Request, res: Response) => {
    var products = await productRepository.find();
    return res.status(200).json(products);
}

export const getProductById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const product = await productRepository.findOneBy({ id });

    if (!product) return res.status(404).json({ message: 'Product not exist' });

    return res.status(200).json(product);
}

export const registerProduct = async (req: Request, res: Response) => {
    const { name, price, inventory, unit } = req.body;

    try {
        const product = productRepository.create({ name, price, inventory, unit });

        await productRepository.save(product);

        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ messge: error });
    }

}

export const updateProduct = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const { name, price, inventory, unit } = req.body;

    try {
        const product = await productRepository.preload({ id, name, price, inventory, unit });

        if (!product) return res.status(404).json({ message: 'Product not found' });

        await productRepository.save(product);

        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
        const product = await productRepository.findOneBy({ id });

        if (!product) return  res.status(404).json({ message: 'Product not exists' });

        await productRepository.delete(id);
        
        return res.status(200).json({ response: true });

    } catch (error) {
        return res.status(404).json({ message: error });
    }
}