const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize'); 
require('dotenv').config(); // Ensure your environment variables are loaded

let sequelize;

const certPath = path.resolve(__dirname, '../../certs/us-east-1-bundle.pem'); // Adjusted relative path
const caCertificate = fs.readFileSync(certPath, 'utf8');

if (process.env.NODE_ENV === 'development') {
    sequelize = new Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: console.log, 
    });
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                ca: caCertificate, // Use the loaded certificate
            },
        },
        logging: console.log,
    });
}

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.error('Database connection failed:', err));

module.exports = sequelize;
