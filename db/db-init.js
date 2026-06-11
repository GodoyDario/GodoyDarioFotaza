require('dotenv').config();
const { sequelize } = require('../models');

async function inicializarBD() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la BD exitosa');
    
    await sequelize.sync({ force: false, alter: true });
    console.log('Tablas creadas/actualizadas correctamente');
    
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la BD:', error);
    process.exit(1);
  }
}

inicializarBD();