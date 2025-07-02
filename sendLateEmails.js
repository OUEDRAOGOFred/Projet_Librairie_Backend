if (require.main === module) {
  sendLateEmails().then(result => {
    console.log(result);
    process.exit(0);
  }).catch(err => {
    console.error('Erreur lors de l\'envoi des emails de retard :', err);
    process.exit(1);
  });
} 