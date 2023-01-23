"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.registerUser = exports.login = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
const user_entity_1 = require("../entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository = database_config_1.default.getRepository(user_entity_1.User);
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        var userData = yield userRepository.findOne({
            where: {
                email
            }
        });
        if (!userData) {
            return res.status(401).json({ message: 'Credentials incorrect ' });
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
            token: jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })
        });
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.login = login;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { email, password, firstName, lastName } = req.body;
        const user = userRepository.create({ email, password, firstName, lastName });
        password = bcrypt.hashSync(password, 10);
        var dataResult = yield userRepository.save(user);
        var payload = {
            id: dataResult.id,
            email: dataResult.email
        };
        return res.status(200).json({
            user: dataResult,
            token: jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })
        });
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.registerUser = registerUser;
