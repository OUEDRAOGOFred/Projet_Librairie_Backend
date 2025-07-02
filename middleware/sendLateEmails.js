const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

async function sendLateEmails() {
  // Récupérer tous les emprunts en retard
  const retards = await prisma.emprunt.findMany({
    where: {
      rendu: false,
      date_retour: null,
      date_emprunt: { lt: new Date() } // À adapter si tu veux une vraie date limite
    },
    include: {
      utilisateur: true,
      livre: true
    }
  });

  if (!retards.length) return 'Aucun retard à notifier.';

  // Configurer le transporteur nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'freddyouedraogo104@gmail.com',
      pass: 'ptaz lfoc qrhv mazn'
    }
  });

  // Envoyer un email à chaque utilisateur en retard
  for (const r of retards) {
    await transporter.sendMail({
      from: 'Bibliothèque 2iE <freddyouedraogo104@gmail.com>',
      to: r.utilisateur.email,
      subject: 'Retard de retour de livre',
      text: `Bonjour ${r.utilisateur.prenom} ${r.utilisateur.nom},\n\nVous avez un retard pour le livre : "${r.livre.titre}".\nMerci de le retourner au plus vite.\n\nCeci est un rappel automatique.`,
    });
  }
  return `${retards.length} notifications envoyées.`;
}

module.exports = sendLateEmails; 