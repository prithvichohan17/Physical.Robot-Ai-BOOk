"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = database_1.dataStore.users.find((user) => user.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = {
            _id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        database_1.dataStore.users.push(user);
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = database_1.dataStore.users.find((user) => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (isPasswordValid) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
        else {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = database_1.dataStore.users.find((u) => u._id === userId);
        if (user) {
            const { password, ...userData } = user;
            return res.status(200).json(userData);
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error getting user data' });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    return res.json({ message: 'User logged out' });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map