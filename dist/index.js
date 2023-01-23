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
require("reflect-metadata");
const app_1 = __importDefault(require("./config/app"));
const database_config_1 = __importDefault(require("./config/database.config"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_strategy_1 = __importDefault(require("./strategies/jwt.strategy"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const shopping_car_route_1 = __importDefault(require("./routes/shopping-car.route"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT_SERVER = parseInt(process.env.PORT, 10) || 3000;
    try {
        yield database_config_1.default.initialize();
        console.log('Database connected!');
    }
    catch (error) {
        console.error(error);
    }
    app_1.default.use('/api/v1/products', product_route_1.default);
    app_1.default.use('/api/v1/users', user_route_1.default);
    app_1.default.use('/api/v1/auth', auth_route_1.default);
    app_1.default.use('/api/v1/cart', jwt_strategy_1.default.authenticate('jwt', { session: false }), shopping_car_route_1.default);
    app_1.default.listen(PORT_SERVER, () => {
        console.log(`Server is listennig in a port ${PORT_SERVER}`);
    });
});
main();
