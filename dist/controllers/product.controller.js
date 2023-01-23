"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.registerProduct = exports.getProductById = exports.getAllProducts = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
const product_entity_1 = require("../entities/product.entity");
const productRepository = database_config_1.default.getRepository(product_entity_1.Product);
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var products = yield productRepository.find();
    return res.status(200).json(products);
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const product = yield productRepository.findOneBy({ id });
    if (!product)
        return res.status(404).json({ message: 'Product not exist' });
    return res.status(200).json(product);
});
exports.getProductById = getProductById;
const registerProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, inventory, unit } = req.body;
    try {
        const product = productRepository.create({ name, price, inventory, unit });
        yield productRepository.save(product);
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(400).json({ messge: error });
    }
});
exports.registerProduct = registerProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { name, price, inventory, unit } = req.body;
    try {
        const product = yield productRepository.preload({ id, name, price, inventory, unit });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        yield productRepository.save(product);
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(400).json({ message: error });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const product = yield productRepository.findOneBy({ id });
        if (!product)
            return res.status(404).json({ message: 'Product not exists' });
        yield productRepository.delete(id);
        return res.status(200).json({ response: true });
    }
    catch (error) {
        return res.status(404).json({ message: error });
    }
});
exports.deleteProduct = deleteProduct;
