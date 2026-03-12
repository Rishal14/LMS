const { Sequelize } = require('sequelize');

let sequelize;

if (!process.env.DATABASE_URL) {
  console.error('❌ CRITICAL ERROR: DATABASE_URL is missing from environment variables!');
  // In serverless environments, we create a dummy instance to prevent top-level import crashes,
  // but connectDB will still fail eventually helping us debug.
  sequelize = new Sequelize('postgres://localhost:5432/dummy', { logging: false });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
}

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }
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
