import { Request, Response, Router } from "express";
import { Customer, BlackList } from "..";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// Login Route
authRouter.post("/local", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await Customer.findOne({ where: { username: username } });
    if (!user || !(await bcrypt.compare(password, user.dataValues.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    const jwtToken = jwt.sign(
      { uuid: uuidv4(), userId: user.dataValues.id },
      "secret",
      { expiresIn: "1h" },
    );
    res.status(200).json({ message: "Connexion réussie", jwtToken });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res
      .status(500)
      .json({ message: "Erreur interne du serveur", error: error });
  }
});

// Logout Route
authRouter.post("/local/logout", async (req, res) => {
  try {
    const tokenToBlacklist = req.headers.authorization;

    if (!tokenToBlacklist) {
      return res
        .status(401)
        .json({ error: "Token missing. Authentication required." });
    }

    const [bearer, token] = tokenToBlacklist.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ error: "Incorrect token format. Authentication required." });
    }

    const existingToken = await BlackList.findOne({
      where: { token: token },
    });

    if (existingToken) {
      return res
        .status(409)
        .json({ error: "Ce token a déjà été utilisé pour la déconnexion." });
    }

    await BlackList.create({ token: token });

    return res.status(204).end();
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Register Route
authRouter.post("/local/register", async (req: Request, res: Response) => {
  try {
    const { password,username } = req.body;

    if (!password || !username) {
      return res
        .status(400)
        .json({
          error: "Veuillez fournir toutes les informations nécessaires.",
        });
    }

    const existingCustomer = await Customer.findOne({ where: { username } });

    if (existingCustomer) {
      return res.status(409).json({ error: "Cet utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      password: hashedPassword,
      username
    });

    const result = newCustomer.dataValues;
    delete result.password;

    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});