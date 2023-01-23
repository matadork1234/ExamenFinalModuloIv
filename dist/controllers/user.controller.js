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
exports.deleteUser = exports.updateUser = exports.registerUser = exports.getUserById = exports.getAllUsers = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
const user_entity_1 = require("../entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const uuid_validate_1 = __importDefault(require("uuid-validate"));
const userRepository = database_config_1.default.getRepository(user_entity_1.User);
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepository.find();
    return res.status(200).json(users);
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, uuid_validate_1.default)(id))
        return res.status(400).json({ message: 'Invalid, please insert a valid id' });
    const user = yield userRepository.findOneBy({ id });
    if (!user)
        res.status(404).json({ message: 'User not exist' });
    return res.status(200).json(user);
});
exports.getUserById = getUserById;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { email, password, firstName, lastName } = req.body;
    password = bcrypt.hashSync(password, 10);
    try {
        const user = userRepository.create({ email, password, firstName, lastName });
        yield userRepository.save(user);
        return res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.registerUser = registerUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    var { email, password, firstName, lastName } = req.body;
    if (!(0, uuid_validate_1.default)(id))
        return res.status(400).json({ message: 'Invalid, please insert a valid id' });
    try {
        const userData = yield userRepository.findOneBy({ id });
        if (!userData)
            return res.status(404).json({ message: 'User not found' });
        if (password) {
            if (!bcrypt.compareSync(password, userData.password)) {
                password = bcrypt.hashSync(password, 10);
            }
        }
        const user = yield userRepository.preload({ id, email, password, firstName, lastName });
        yield userRepository.save(user);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, uuid_validate_1.default)(id))
        return res.status(400).json({ message: 'Invalid, please insert a valid id' });
    try {
        const user = yield userRepository.findOneBy({ id });
        if (!user)
            return res.status(404).json({ message: 'User not found ' });
        yield userRepository.delete(id);
        return res.status(200).json({ succees: true });
    }
    catch (error) {
        return res.status(400).json({ message: error });
    }
});
exports.deleteUser = deleteUser;
