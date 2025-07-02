const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.utilisateur.findUnique({
    where: { email: 'freddyouedraogo@gmail.com' }
  });

  if (!admin) {
    await prisma.utilisateur.create({
      data: {
        nom: 'OUEDRAOGO',
        prenom: 'Freddy',
        email: 'freddyouedraogo@gmail.com',
        mot_de_passe: '$2b$10$wH8QwQwQwQwQwQwQwQwQOeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', // hashé
        role: 'admin'
      }
    });
    console.log('Administrateur inséré avec succès !');
  } else {
    console.log('Administrateur déjà présent dans la base.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 