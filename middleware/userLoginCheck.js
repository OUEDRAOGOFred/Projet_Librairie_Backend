const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../config');

const userLoginCheck = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe obligatoires.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide." });
    }

    // Recherche de l'utilisateur par email
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      let hashStored = user.mot_de_passe;
    if (!mot_de_passe || !hashStored) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }
    let isMatch = await bcrypt.compare(mot_de_passe, hashStored);
      if (!isMatch) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      let token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.secret);

      res.json({
        token: token,
        email: user.email,
        id: user.id,
        role: user.role,
        message: "Connexion réussie"
      });
  } catch (error) {
    res.json({ "Error": true, "Message": error.message });
  }
};

module.exports = userLoginCheck;
