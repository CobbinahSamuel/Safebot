console.log('Running import test...');

try {
  console.log('Importing dotenv...');
  await import('dotenv');
  console.log('  ✅ OK');

  console.log('Importing express...');
  await import('express');
  console.log('  ✅ OK');

  console.log('Importing cors...');
  await import('cors');
  console.log('  ✅ OK');

  console.log('Importing cookie-parser...');
  await import('cookie-parser');
  console.log('  ✅ OK');

  console.log('Importing ./middleware/errorMiddleware.js...');
  await import('./middleware/errorMiddleware.js');
  console.log('  ✅ OK');

  console.log('Importing ./config/db.js...');
  await import('./config/db.js');
  console.log('  ✅ OK');

  console.log('Importing ./routes/adminRoutes.js...');
  await import('./routes/adminRoutes.js');
  console.log('  ✅ OK');

  console.log('Importing ./routes/incidentRoutes.js...');
  await import('./routes/incidentRoutes.js');
  console.log('  ✅ OK');

  console.log('Importing ./routes/authRoutes.js...');
  await import('./routes/authRoutes.js');
  console.log('  ✅ OK');

  console.log('Importing ./routes/testRoutes.js...');
  await import('./routes/testRoutes.js');
  console.log('  ✅ OK');

  console.log('Importing ./bot/bot.js...');
  await import('./bot/bot.js');
  console.log('  ✅ OK');

  console.log('\n🎉 All modules imported successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌❌❌ An error occurred during import: ❌❌❌');
  console.error(error);
  process.exit(1);
}
