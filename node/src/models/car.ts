import { DataTypes, Sequelize } from "sequelize";

export const CarModel = (sequelize: Sequelize) => {
  return sequelize.define("customer", {
        brand: DataTypes.STRING,
        model: DataTypes.STRING,
        year: DataTypes.NUMBER,
        color: DataTypes.STRING,
  });
};