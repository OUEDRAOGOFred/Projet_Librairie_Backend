const db = require('./database');

const moreBooks = [
  {
    titre: "Introduction à la Physique Quantique",
    auteur: "Albert Einstein",
    genre: "Science",
    description: "Un ouvrage de référence sur la physique quantique et ses applications modernes.",
    disponible: true
  },
  {
    titre: "Le Chat du Rabbin",
    auteur: "Joann Sfar",
    genre: "Bande dessinée",
    description: "Une BD philosophique et drôle sur la vie d'un chat dans l'Algérie coloniale.",
    disponible: true
  },
  {
    titre: "Les Fleurs du mal",
    auteur: "Charles Baudelaire",
    genre: "Poésie",
    description: "Le recueil de poèmes le plus célèbre de Baudelaire, entre spleen et idéal.",
    disponible: true
  },
  {
    titre: "Python pour les Nuls",
    auteur: "John Paul Mueller",
    genre: "Informatique",
    description: "Un guide pratique pour débuter la programmation en Python.",
    disponible: true
  },
  {
    titre: "L'Univers en 100 questions",
    auteur: "Hubert Reeves",
    genre: "Science",
    description: "Un livre de vulgarisation scientifique pour comprendre l'univers simplement.",
    disponible: true
  },
  {
    titre: "Astérix le Gaulois",
    auteur: "René Goscinny & Albert Uderzo",
    genre: "Bande dessinée",
    description: "La toute première aventure d'Astérix et Obélix dans la Gaule romaine.",
    disponible: true
  },
  {
    titre: "Le Meilleur des Mondes",
    auteur: "Aldous Huxley",
    genre: "Science-fiction",
    description: "Un roman d'anticipation sur une société contrôlée par la technologie et le conditionnement.",
    disponible: true
  },
  {
    titre: "Le Petit Nicolas",
    auteur: "René Goscinny & Sempé",
    genre: "Jeunesse",
    description: "Les aventures tendres et drôles d'un petit garçon et de ses copains.",
    disponible: true
  },
  {
    titre: "L'Art de la Guerre",
    auteur: "Sun Tzu",
    genre: "Stratégie",
    description: "Le traité militaire le plus célèbre du monde, applicable à la vie et au management.",
    disponible: true
  },
  {
    titre: "Le Code de la Route 2024",
    auteur: "Collectif",
    genre: "Pratique",
    description: "Le guide officiel pour réussir l'examen du code de la route en France.",
    disponible: true
  }
];

console.log('Ajout de nouveaux livres variés à la base de données...');

const insertSQL = 'INSERT INTO livres (titre, auteur, genre, description, disponible) VALUES (?, ?, ?, ?, ?)';

let insertedCount = 0;
moreBooks.forEach((book, index) => {
  db.query(insertSQL, [book.titre, book.auteur, book.genre, book.description, book.disponible], (err) => {
    if (err) {
      console.error(`Erreur lors de l'ajout du livre "${book.titre}":`, err);
    } else {
      insertedCount++;
      console.log(`Ajouté: ${book.titre} (${book.genre})`);
    }
    if (index === moreBooks.length - 1) {
      console.log(`\n${insertedCount} livre(s) ajouté(s) avec succès !`);
      db.end();
    }
  });
}); 