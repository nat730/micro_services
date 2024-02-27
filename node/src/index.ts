import { Sequelize } from 'sequelize';
import { CarModel } from './models/car';
import { carRouter } from './router/car';
import express from 'express';

const app = express();

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db/database.sqlite",
  });
  
export const Car = CarModel(sequelize);
sequelize.sync()

app.use('/', carRouter);

app.listen(3000, () => {
  console.log(`API Gateway démarré sur le port 3000`);
});
