"use strict";
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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sequelize_1 = require("sequelize");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});
class Car extends sequelize_1.Model {
}
Car.init({
    marque: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    modele: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    annee: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    couleur: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'car',
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.sync({ force: true });
}))();
app.get('/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cars = yield Car.findAll();
    res.json({ cars });
}));
app.get('/cars/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const car = yield Car.findByPk(id);
    if (!car) {
        res.status(404).json({ message: 'Car not found' });
    }
    else {
        res.json({ car });
    }
}));
app.post('/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { marque, modele, annee, couleur } = req.body;
    try {
        const car = yield Car.create({ marque, modele, annee, couleur });
        res.status(201).json({ message: 'Car added successfully', car });
    }
    catch (error) {
        res.status(400).json({ message: 'Error adding car', error });
    }
}));
app.put('/cars/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { marque, modele, annee, couleur } = req.body;
    try {
        const car = yield Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        yield car.update({ marque, modele, annee, couleur });
        res.json({ message: 'Car updated successfully', car });
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating car', error });
    }
}));
app.delete('/cars/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const car = yield Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        yield car.destroy();
        res.json({ message: 'Car deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting car', error });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
