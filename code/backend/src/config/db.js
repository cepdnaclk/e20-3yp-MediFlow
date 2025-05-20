const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // for self-signed certs
        },
      },
        logging: false, // Set true to see SQL queries
    }
);


if (process.env.NODE_ENV !== 'test') {
    sequelize
        .authenticate()
        .then(() => console.log("✅ PostgreSQL connected"))
        .catch((err) => console.log("❌ Database error:", err));
}

module.exports = sequelize;
