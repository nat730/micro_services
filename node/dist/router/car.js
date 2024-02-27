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
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRouter = void 0;
const express_1 = require("express");
const __1 = require("..");
exports.carRouter = (0, express_1.Router)();
// GET
exports.carRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield __1.Car.findAll();
        res.json(cars);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}));
// POST
exports.carRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand, model, year, color } = req.body;
        const newCar = yield __1.Car.create({ brand, model, year, color });
        res.status(201).json(newCar);
    }
    catch (error) {
        console.error("Erreur lors de l'ajout de la voiture :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}));
// PUT
exports.carRouter.put("//:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carId = req.params.id;
        const { brand, model, year, color } = req.body;
        const car = yield __1.Car.findByPk(carId);
        if (!car) {
            return res.status(404).json({ error: "Voiture non trouvée" });
        }
        yield car.update({ brand, model, year, color });
        res.json(car);
    }
    catch (error) {
        console.error("Erreur lors de la mise à jour de la voiture :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}));
// DELETE
exports.carRouter.delete("//:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carId = req.params.id;
        const car = yield __1.Car.findByPk(carId);
        if (!car) {
            return res.status(404).json({ error: "Voiture non trouvée" });
        }
        yield car.destroy();
        res.status(204).end();
    }
    catch (error) {
        console.error("Erreur lors de la suppression de la voiture :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}));
