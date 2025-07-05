-- 1. Création de la base de données
CREATE DATABASE IF NOT EXISTS ProjetDev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ProjetDev;

-- 2. Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('etudiant', 'admin') DEFAULT 'etudiant',
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Table des livres
CREATE TABLE IF NOT EXISTS livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    description TEXT,
    disponible BOOLEAN DEFAULT TRUE,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Table des emprunts
CREATE TABLE IF NOT EXISTS emprunts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    livre_id INT,
    date_emprunt DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_retour DATETIME,
    rendu BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Table des commentaires/notes
CREATE TABLE IF NOT EXISTS commentaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    livre_id INT,
    commentaire TEXT,
    note INT CHECK (note >= 1 AND note <= 5),
    date_commentaire DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE
) ENGINE=InnoDB;

