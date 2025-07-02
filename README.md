# 2iE Bibliothèque — Backend

Ce dépôt contient le **backend** de l'application de gestion de bibliothèque, développé avec **Node.js**, **Express** et **Prisma** (ORM), utilisant **MySQL**.

---

## Fonctionnalités principales

- API REST sécurisée (JWT)
- Gestion des utilisateurs (admin/étudiant)
- Gestion des livres et des emprunts
- Notifications de retard
- Compatible avec le frontend Next.js

---

## Prérequis

- Node.js (v16+ recommandé)
- MySQL/MariaDB

---

## Installation

```bash
git clone <url_de_ce_repo>
cd secu/secu
npm install
```

---

## Configuration

- Configure la connexion MySQL dans `secu/secu/database.js` ou via `.env` si utilisé.
- Mets à jour le nom d'utilisateur, mot de passe et base de données selon ton environnement.

---

## Initialisation de la base de données

- Exécute le script SQL fourni pour créer les tables nécessaires (voir le README du frontend pour un exemple).
- Tu peux utiliser Prisma pour générer le schéma si besoin.

---

## Lancement

```bash
npm start
```

- L'API sera disponible sur [http://localhost:4400](http://localhost:4400)

---

## Déploiement sur Render

### Prérequis
- Un compte Render.com
- Votre code source sur GitHub/GitLab

### Étapes de déploiement

1. **Connectez votre dépôt GitHub à Render**
   - Allez sur [render.com](https://render.com)
   - Cliquez sur "New" → "Web Service"
   - Connectez votre dépôt GitHub

2. **Configuration du service**
   - **Name**: `2ie-bibliotheque-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

3. **Variables d'environnement**
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: URL de votre base de données MySQL (fournie par Render)
   - `JWT_SECRET`: Votre secret JWT (généré automatiquement par Render)

4. **Base de données MySQL**
   - Créez une nouvelle base de données MySQL sur Render
   - Copiez l'URL de connexion dans la variable `DATABASE_URL`

5. **Déploiement**
   - Cliquez sur "Create Web Service"
   - Render va automatiquement déployer votre application

### Migration de la base de données

Après le déploiement, exécutez la migration :

```bash
# Via le dashboard Render ou en local
npm run migrate
```

---

## Structure du projet

- `middleware/` : Contrôleurs, routes, logique métier
- `Data/` : Modèles Prisma
- `server.js` : Point d'entrée de l'API

---

## Auteur

- Freddy OUEDRAOGO — Projet 2iE Bibliothèque

---
