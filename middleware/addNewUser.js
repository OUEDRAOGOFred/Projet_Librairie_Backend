const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let bcrypt = require("bcrypt");
	
const addNewUser = async (req, res, next) => {
try {
    let saltRounds = 10;
  let hashedPassword = await bcrypt.hash(req.body.mot_de_passe, saltRounds);

  const { nom, prenom, email, mot_de_passe } = req.body;
  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ Error: true, Message: 'Tous les champs sont obligatoires.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ Error: true, Message: "Format d'email invalide." });
  }
  if (mot_de_passe.length < 6) {
    return res.status(400).json({ Error: true, Message: 'Le mot de passe doit faire au moins 6 caractères.' });
  }

    // Vérifie si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
      return res.json({ Error: false, Message: "Email Id already registered" });
    }

    await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        mot_de_passe: hashedPassword,
        // role: 'etudiant' // optionnel, par défaut
				}
			});
    res.json({ Error: false, Message: "Success" });
		} catch (error) {
    console.error('Erreur :', error);
    res.json({ Error: true, Message: error.message });
	}
};

   module.exports = addNewUser;




