import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: any;
}

const app = express();

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token as string, 'your_secret_key', (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

const flaskProxy = createProxyMiddleware('/api/flask', {
    target: 'http://127.0.0.1:8000/',
    changeOrigin: true,
    pathRewrite: {
        '^/api/flask': '/',
    },
});

const nodeProxy = createProxyMiddleware('/api/node', {
    target: 'http://localhost:3000/',
    changeOrigin: true,
    pathRewrite: {
        '^/api/node': '',
    },
});

app.use('/api/flask', authenticateToken, flaskProxy);
app.use('/api/node', authenticateToken, nodeProxy);

const port = 4000;
app.listen(port, () => {
    console.log(`API Gateway démarré sur le port ${port}`);
});
