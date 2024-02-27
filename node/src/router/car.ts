import { Request, Response, Router } from "express";
import { Car } from "..";

export const carRouter = Router();

// GET
carRouter.get("/", async (req: Request, res: Response) => {
  try {
    const cars = await Car.findAll();
    res.json(cars);
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// POST
carRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { brand, model, year, color } = req.body;
    const newCar = await Car.create({ brand, model, year, color });
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la voiture :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// PUT
carRouter.put("//:id", async (req: Request, res: Response) => {
  try {
    const carId = req.params.id;
    const { brand, model, year, color } = req.body;
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: "Voiture non trouvée" });
    }
    await car.update({ brand, model, year, color });
    res.json(car);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la voiture :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// DELETE
carRouter.delete("//:id", async (req: Request, res: Response) => {
  try {
    const carId = req.params.id;
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: "Voiture non trouvée" });
    }
    await car.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Erreur lors de la suppression de la voiture :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});
