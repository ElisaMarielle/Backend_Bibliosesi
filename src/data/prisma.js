// const {PrismaClient} = require('@prisma/client');
// const {PrismaMariaDb} = require('@prisma/adapter-mariadb');

// const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
// const prisma = new PrismaClient({adapter});

// module.exports = prisma;

require('dotenv').config();

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma/client.js');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;