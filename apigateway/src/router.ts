import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

interface CustomRequest extends Request {
    user?: any;
}

const users = [
    { id: 1, username: 'user1', password: 'password' },
];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('Username already exists');
    }
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.send('User created successfully');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }
    const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key');
    res.json({ token });
});

function authenticateToken(req: CustomRequest, res: Response, next: NextFunction) {
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
}

app.get('/user', authenticateToken, (req: CustomRequest, res: Response) => {
    res.json(req.user);
});

const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway démarré sur le port ${port}`);
});
