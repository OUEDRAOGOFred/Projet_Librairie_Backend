const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  },
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

async function addBooks() {
  try {
    console.log('📚 Début de l\'ajout des livres à la base de données...');
    
    // Vérifier combien de livres existent déjà
    const existingBooks = await prisma.livre.count();
    console.log(`📖 ${existingBooks} livre(s) déjà présent(s) dans la base de données`);
    
    if (existingBooks > 0) {
      console.log('⚠️ Des livres existent déjà. Voulez-vous continuer ? (Ctrl+C pour arrêter)');
      // Attendre 3 secondes pour permettre l'arrêt
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    let insertedCount = 0;
    
    for (const book of sampleBooks) {
      try {
        await prisma.livre.create({
          data: book
        });
        insertedCount++;
        console.log(`✅ Ajouté: ${book.titre} par ${book.auteur}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Le livre "${book.titre}" existe déjà, ignoré.`);
        } else {
          console.error(`❌ Erreur lors de l'ajout du livre "${book.titre}":`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 ${insertedCount} livre(s) ajouté(s) avec succès !`);
    console.log(`📊 Total des livres dans la base: ${await prisma.livre.count()}`);
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBooks(); 