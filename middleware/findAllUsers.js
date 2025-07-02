const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findAllUsers = async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany();
    res.json({ "Error": false, "Message": "Success", "Users": users });
} catch (error) {
    res.json({ "Error": true, "Message": error.message });
}
};

module.exports = findAllUsers;