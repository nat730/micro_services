import { DataTypes, Sequelize } from "sequelize";

export const CustomerModel = (sequelize: Sequelize) => {
  return sequelize.define("customer", {
    username:DataTypes.STRING,
    password: DataTypes.STRING,
  });
};