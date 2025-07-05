#!/bin/bash

echo "🚀 Démarrage de l'application 2iE Bibliothèque..."

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

# Migrer la base de données si nécessaire
echo "🗄️ Migration de la base de données..."
npx prisma db push --accept-data-loss

# Créer l'administrateur s'il n'existe pas
echo "👤 Vérification de l'administrateur..."
node createAdmin.js

# Ajouter des livres de test si la base est vide
echo "📚 Vérification des livres dans la base..."
BOOK_COUNT=$(node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.livre.count().then(count => { console.log(count); prisma.\$disconnect(); }).catch(() => { console.log('0'); prisma.\$disconnect(); });")

if [ "$BOOK_COUNT" = "0" ]; then
  echo "📖 Aucun livre trouvé, ajout de livres de test..."
  node addBooksWithPrisma.js
else
  echo "📖 $BOOK_COUNT livre(s) déjà présent(s) dans la base"
fi

# Démarrer l'application
echo "✅ Démarrage du serveur..."
node server.js 