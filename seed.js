require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const exists = await User.findOne({ email: 'admin@taskflow.com' });
    if (exists) {
      console.log('ℹ️  Admin ya existe: admin@taskflow.com');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@taskflow.com',
      password: 'admin1234',
      role: 'admin'
    });

    console.log('✅ Admin creado');
    console.log('   Email: admin@taskflow.com');
    console.log('   Password: admin1234');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();