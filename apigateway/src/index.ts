import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { BlackListModel } from "./models/blacklist";
import { CustomerModel } from './models/customer';
import { Sequelize } from 'sequelize';
import authenticationMiddleware from './middleware/middleware_jws';
import { authRouter } from './router/customer';

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db/database.sqlite",
  });
  
export const Customer = CustomerModel(sequelize);
export const BlackList = BlackListModel(sequelize)
sequelize.sync({ force: true })

const app = express();

const flaskProxy = createProxyMiddleware('/api/flask', {
    target: 'http://localhost:8000/',
    changeOrigin: true,
    pathRewrite: {
        '^/api/flask': '/',
    },
});

const nodeProxy = createProxyMiddleware('/api/node', {
    target: 'http://localhost:3000/',
    changeOrigin: true,
    pathRewrite: {
        '^\/api\/node\/cars': '/',
    },
});

app.use('/api/flask',authenticationMiddleware, flaskProxy);
app.use('/api/node/cars', authenticationMiddleware, nodeProxy);
app.use(express.json())
app.use('/api/auth', authRouter);



const port = 4000;
app.listen(port, () => {
    console.log(`API Gateway démarré sur le port ${port}`);
});
