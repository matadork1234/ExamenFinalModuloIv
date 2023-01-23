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
exports.ShoppingCart = void 0;
const typeorm_1 = require("typeorm");
const detail_shopping_entity_1 = require("./detail-shopping.entity");
const status_enum_1 = require("./enum/status.enum");
const user_entity_1 = require("./user.entity");
let ShoppingCart = class ShoppingCart {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('identity'),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { name: 'invoice_number', default: 0, nullable: false }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { enum: status_enum_1.TStatus, nullable: false }),
    __metadata("design:type", String)
], ShoppingCart.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'total_amount', default: 0, nullable: false }),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'udapted_at', type: 'timestamptz', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, u => u.shoppingCars),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'id' }),
    __metadata("design:type", user_entity_1.User)
], ShoppingCart.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detail_shopping_entity_1.DetailShopping, dt => dt.shoppingCart),
    __metadata("design:type", Array)
], ShoppingCart.prototype, "detailsShopping", void 0);
ShoppingCart = __decorate([
    (0, typeorm_1.Entity)('shopping_carts')
], ShoppingCart);
exports.ShoppingCart = ShoppingCart;
