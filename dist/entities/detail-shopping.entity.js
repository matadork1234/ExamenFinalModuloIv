"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailShopping = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const shopping_cart_entity_1 = require("./shopping-cart.entity");
let DetailShopping = class DetailShopping {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('identity'),
    __metadata("design:type", Number)
], DetailShopping.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { nullable: false, default: 0 }),
    __metadata("design:type", Number)
], DetailShopping.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { nullable: false, default: 0 }),
    __metadata("design:type", Number)
], DetailShopping.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, p => p.detailsShopping),
    (0, typeorm_1.JoinColumn)({ name: 'product_id', referencedColumnName: 'id' }),
    __metadata("design:type", product_entity_1.Product)
], DetailShopping.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shopping_cart_entity_1.ShoppingCart, sp => sp.detailsShopping, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'shopping_cart_id', referencedColumnName: 'id' }),
    __metadata("design:type", shopping_cart_entity_1.ShoppingCart)
], DetailShopping.prototype, "shoppingCart", void 0);
DetailShopping = __decorate([
    (0, typeorm_1.Entity)('details_shopping')
], DetailShopping);
exports.DetailShopping = DetailShopping;
