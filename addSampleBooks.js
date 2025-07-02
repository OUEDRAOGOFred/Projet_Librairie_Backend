const db = require('./database');

const sampleBooks = [
  {
    titre: "Les Misérables",
    auteur: "Victor Hugo",
    genre: "Roman classique",
    description: "Un chef-d'œuvre de la littérature française qui suit Jean Valjean dans sa quête de rédemption.",
    disponible: true
  },
  {
    titre: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    genre: "Conte philosophique",
    description: "Un conte poétique et philosophique sur l'amitié, l'amour et le sens de la vie.",
    disponible: true
  },
  {
    titre: "1984",
    auteur: "George Orwell",
    genre: "Science-fiction",
    description: "Une dystopie qui dépeint une société totalitaire sous surveillance constante.",
    disponible: true
  },
  {
    titre: "L'Étranger",
    auteur: "Albert Camus",
    genre: "Roman philosophique",
    description: "L'histoire de Meursault, un homme confronté à l'absurdité de l'existence.",
    disponible: true
  },
  {
    titre: "Madame Bovary",
    auteur: "Gustave Flaubert",
    genre: "Roman réaliste",
    description: "Le portrait d'Emma Bovary, une femme en quête de passion et d'évasion.",
    disponible: true
  },
  {
    titre: "Le Seigneur des Anneaux",
    auteur: "J.R.R. Tolkien",
    genre: "Fantasy",
    description: "Une épopée fantastique sur la quête pour détruire un anneau maléfique.",
    disponible: true
  },
  {
    titre: "Harry Potter à l'école des sorciers",
    auteur: "J.K. Rowling",
    genre: "Fantasy jeunesse",
    description: "Les aventures d'un jeune sorcier découvrant le monde magique.",
    disponible: true
  },
  {
    titre: "Don Quichotte",
    auteur: "Miguel de Cervantes",
    genre: "Roman picaresque",
    description: "Les aventures d'un chevalier errant et de son fidèle écuyer Sancho Panza.",
    disponible: true
  },
  {
    titre: "Crime et Châtiment",
    auteur: "Fiodor Dostoïevski",
    genre: "Roman psychologique",
    description: "L'histoire de Raskolnikov, un étudiant qui commet un meurtre et vit avec sa culpabilité.",
    disponible: true
  },
  {
    titre: "Le Comte de Monte-Cristo",
    auteur: "Alexandre Dumas",
    genre: "Roman d'aventure",
    description: "L'histoire d'Edmond Dantès et de sa quête de vengeance après avoir été injustement emprisonné.",
    disponible: true
  }
];

console.log('📚 Ajout de livres de test à la base de données...');

// Vérifier si la table existe et la créer si nécessaire
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT,
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createTableSQL, (err) => {
  if (err) {
    console.error('❌ Erreur lors de la création de la table:', err);
    return;
  }
  console.log('✅ Table livres créée ou déjà existante');

  // Vérifier s'il y a déjà des livres
  db.query('SELECT COUNT(*) as count FROM livres', (err, results) => {
    if (err) {
      console.error('❌ Erreur lors du comptage des livres:', err);
      return;
    }

    const bookCount = results[0].count;
    if (bookCount > 0) {
      console.log(`📖 ${bookCount} livre(s) déjà présent(s) dans la base de données`);
      return;
    }

    // Ajouter les livres de test
    const insertSQL = 'INSERT INTO livres (titre, auteur, genre, description, disponible) VALUES (?, ?, ?, ?, ?)';
    
    let insertedCount = 0;
    sampleBooks.forEach((book, index) => {
      db.query(insertSQL, [book.titre, book.auteur, book.genre, book.description, book.disponible], (err) => {
        if (err) {
          console.error(`❌ Erreur lors de l'ajout du livre "${book.titre}":`, err);
        } else {
          insertedCount++;
          console.log(`✅ Ajouté: ${book.titre} par ${book.auteur}`);
        }

        // Si c'est le dernier livre, fermer la connexion
        if (index === sampleBooks.length - 1) {
          console.log(`\n🎉 ${insertedCount} livre(s) ajouté(s) avec succès !`);
          db.end();
        }
      });
    });
  });
}); 