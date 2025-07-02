#!/bin/bash

echo "🚀 Démarrage de l'application 2iE Bibliothèque..."

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

# Migrer la base de données si nécessaire
echo "🗄️ Migration de la base de données..."
npx prisma db push --accept-data-loss

# Démarrer l'application
echo "✅ Démarrage du serveur..."
npm start 