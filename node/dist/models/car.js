"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModel = void 0;
const sequelize_1 = require("sequelize");
const CarModel = (sequelize) => {
    return sequelize.define("customer", {
        brand: sequelize_1.DataTypes.STRING,
        model: sequelize_1.DataTypes.STRING,
        year: sequelize_1.DataTypes.NUMBER,
        color: sequelize_1.DataTypes.STRING,
    });
};
exports.CarModel = CarModel;
