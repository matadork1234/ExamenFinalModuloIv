"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shopping_car_controller_1 = require("../controllers/shopping-car.controller");
const router = (0, express_1.Router)();
router.post('/product', shopping_car_controller_1.AddProductCart);
router.delete('/product/:id', shopping_car_controller_1.deleteProductShopping);
router.post('/pay', shopping_car_controller_1.paymentShoppingCart);
exports.default = router;
