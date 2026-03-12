const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected (Neon)');
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Do not process.exit(1) in serverless environments as it causes 500 errors
    throw error;
  }
};

module.exports = { sequelize, connectDB };
