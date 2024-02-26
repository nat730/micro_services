import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sequelize initialization
const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});



class Car extends Model {
  public marque!: string;
  public modele!: string;
  public annee!: number;
  public couleur!: string;
}
Car.init(
  {
    marque: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modele: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    annee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    couleur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'car',
  }
);

(async () => {
  await sequelize.sync({ force: true });
})();

app.get('/cars', async (req: Request, res: Response) => {
  const cars = await Car.findAll();
  res.json({ cars });
});

app.get('/cars/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const car = await Car.findByPk(id);
  if (!car) {
    res.status(404).json({ message: 'Car not found' });
  } else {
    res.json({ car });
  }
});

app.post('/cars', async (req: Request, res: Response) => {
  const { marque, modele, annee, couleur } = req.body;
  try {
    const car = await Car.create({ marque, modele, annee, couleur });
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (error) {
    res.status(400).json({ message: 'Error adding car', error });
  }
});

app.put('/cars/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { marque, modele, annee, couleur } = req.body;
  try {
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    await car.update({ marque, modele, annee, couleur });
    res.json({ message: 'Car updated successfully', car });
  } catch (error) {
    res.status(400).json({ message: 'Error updating car', error });
  }
});

app.delete('/cars/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    await car.destroy();
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting car', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
