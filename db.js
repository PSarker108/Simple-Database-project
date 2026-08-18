import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: JSON.stringify(process.env.DB_PASSWORD),
});

const sequelize = new Sequelize( //sequelizer expects these 4 peremeters
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

//-------------------User Model------------------

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },

}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createAt',
  updatedAt: 'updateAt',
});

//-----------------Blog Model------------------

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  blogTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  blog: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  tableName: 'blogs',
  timestamps: true,
  createdAt: 'createAt',
  updatedAt: 'updateAt',
});

//----------------Relation----------------

User.hasMany(Blog, {
  foreignKey: 'userId',
});

Blog.belongsTo(User, {
  foreignKey: 'userId',
});

async function initDB() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Database connected and table ready.');
}

async function closeDB() {
  await sequelize.close();
}

export { sequelize, User, initDB, Blog, closeDB };