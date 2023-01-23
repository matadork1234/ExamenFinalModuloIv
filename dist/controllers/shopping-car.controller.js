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
exports.paymentShoppingCart = exports.deleteProductShopping = exports.AddProductCart = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
const detail_shopping_entity_1 = require("../entities/detail-shopping.entity");
const status_enum_1 = require("../entities/enum/status.enum");
const product_entity_1 = require("../entities/product.entity");
const shopping_cart_entity_1 = require("../entities/shopping-cart.entity");
const shoppingCartRepository = database_config_1.default.getRepository(shopping_cart_entity_1.ShoppingCart);
const detailShoppingRepository = database_config_1.default.getRepository(detail_shopping_entity_1.DetailShopping);
const productRepository = database_config_1.default.getRepository(product_entity_1.Product);
const AddProductCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, price, quantity } = req.body;
    var invoiceNumber = 0;
    const user = req.user;
    var product = yield productRepository.findOne({
        where: {
            id: productId
        }
    });
    const shoppingCartExists = yield shoppingCartRepository.findOne({
        where: {
            user: {
                id: user.id
            },
            status: status_enum_1.TStatus.PENDING
        }
    });
    if (!shoppingCartExists) {
        const generalShoppingCart = yield shoppingCartRepository.find({
            order: {
                invoiceNumber: 'desc'
            },
            take: 1,
        });
        if (generalShoppingCart.length == 0) {
            invoiceNumber = 1;
        }
        else {
            invoiceNumber = generalShoppingCart[0].invoiceNumber + 1;
        }
        var queryRunner = database_config_1.default.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            var shoppingCart = new shopping_cart_entity_1.ShoppingCart();
            shoppingCart.status = status_enum_1.TStatus.PENDING;
            shoppingCart.totalAmount = parseFloat(price);
            shoppingCart.user = user;
            shoppingCart.invoiceNumber = invoiceNumber;
            var newShoppingCart = yield queryRunner.manager.save(shopping_cart_entity_1.ShoppingCart, shoppingCart);
            var detailShopping = new detail_shopping_entity_1.DetailShopping();
            detailShopping.shoppingCart = newShoppingCart;
            detailShopping.product = product;
            detailShopping.quantity = quantity;
            detailShopping.price = parseFloat(price);
            yield queryRunner.manager.save(detail_shopping_entity_1.DetailShopping, detailShopping);
            yield queryRunner.commitTransaction();
            return res.status(200).json({
                success: true,
                data: shoppingCart
            });
        }
        catch (error) {
            queryRunner.rollbackTransaction();
            return res.status(400).json({ success: false, message: error });
        }
        finally {
            yield queryRunner.release();
        }
    }
    else {
        var queryRunner = database_config_1.default.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            var existsProduct = yield queryRunner.manager.findOne(detail_shopping_entity_1.DetailShopping, {
                where: {
                    product: {
                        id: product.id
                    },
                    shoppingCart: {
                        id: shoppingCartExists.id
                    }
                }
            });
            if (existsProduct)
                return res.status(400).json({ success: false, message: 'Product exist in the shopping cart, please selected other product' });
            var detailShopping = new detail_shopping_entity_1.DetailShopping();
            detailShopping.price = price;
            detailShopping.quantity = quantity;
            detailShopping.product = product;
            detailShopping.shoppingCart = shoppingCartExists;
            yield queryRunner.manager.save(detail_shopping_entity_1.DetailShopping, detailShopping);
            shoppingCartExists.totalAmount = shoppingCartExists.totalAmount + price;
            yield queryRunner.manager.save(shopping_cart_entity_1.ShoppingCart, shoppingCartExists);
            yield queryRunner.commitTransaction();
            return res.status(200).json({
                success: true,
                data: shoppingCartExists
            });
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            return res.status(400).json({ success: false, message: error });
        }
        finally {
            yield queryRunner.release();
        }
    }
});
exports.AddProductCart = AddProductCart;
const deleteProductShopping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const user = req.user;
    const shoppingCart = yield shoppingCartRepository.findOne({
        where: {
            user: {
                id: user.id
            },
            status: status_enum_1.TStatus.PENDING
        }
    });
    const product = yield productRepository.findOneBy({ id });
    if (!shoppingCart) {
        return res.status(400).json({ success: false, message: 'Not exists a shopping cart' });
    }
    else {
        const queryRunner = database_config_1.default.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            const detailShoppingCart = yield queryRunner.manager.findOne(detail_shopping_entity_1.DetailShopping, {
                where: {
                    shoppingCart: {
                        id: shoppingCart.id
                    },
                    product: {
                        id: product.id
                    }
                }
            });
            yield queryRunner.manager.delete(detail_shopping_entity_1.DetailShopping, detailShoppingCart.id);
            shoppingCart.totalAmount = shoppingCart.totalAmount - detailShoppingCart.price;
            yield queryRunner.manager.save(shoppingCart);
            yield queryRunner.commitTransaction();
            return res.status(200).json({ success: true, data: shoppingCart });
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            return res.status(400).json({ success: false, error: error });
        }
        finally {
            yield queryRunner.release();
        }
    }
});
exports.deleteProductShopping = deleteProductShopping;
const paymentShoppingCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const shoppingCart = yield shoppingCartRepository.findOne({
        where: {
            user: {
                id: user.id
            },
            status: status_enum_1.TStatus.PENDING
        }
    });
    if (!shoppingCart) {
        return res.status(404).json({ success: false, message: 'Not exist shopping cart' });
    }
    const detailShoppingCart = yield detailShoppingRepository.find({
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
        shoppingCart.status = status_enum_1.TStatus.PAID;
        yield shoppingCartRepository.save(shoppingCart);
        return res.status(200).json({ success: true, data: shoppingCart });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error });
    }
});
exports.paymentShoppingCart = paymentShoppingCart;
