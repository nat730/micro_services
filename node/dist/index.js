"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const car_1 = require("./models/car");
const car_2 = require("./router/car");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: "db/database.sqlite",
});
exports.Car = (0, car_1.CarModel)(exports.sequelize);
exports.sequelize.sync();
app.use('/', car_2.carRouter);
app.listen(3000, () => {
    console.log(`API Gateway démarré sur le port 3000`);
});
