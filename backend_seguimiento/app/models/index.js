const config = require("../config/db.config.js")
const fs = require('fs');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    operatorsAliases: false,
    dialect: config.dialect,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },

    dialectOptions: {
    ssl: {
      ca: fs.readFileSync("C:/Users/Salet/Downloads/ca.pem"),  // Ruta al archivo del certificado de autoridad (CA)
      cert: fs.readFileSync("C:/Users/Salet/Downloads/client-cert.pem"),  // Ruta al archivo del certificado del cliente
      key: fs.readFileSync("C:/Users/Salet/Downloads/client-key.pem"),  // Ruta al archivo de la clave privada del cliente

      //ca: fs.readFileSync("/Users/sammendez/Desktop/frontend_tutorial3/FrontFinal/ca.pem"),  // Ruta al archivo del certificado de autoridad (CA)
     // cert: fs.readFileSync("/Users/sammendez/Desktop/frontend_tutorial3/FrontFinal/client-cert.pem"),
     // key: fs.readFileSync("/Users/sammendez/Desktop/frontend_tutorial3/FrontFinal/client-key.pem"), 
    }
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.client = require("./client.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.vitals = require("../models/vitals.model.js")(sequelize, Sequelize);
db.contact = require("../models/contact.model.js")(sequelize, Sequelize);
db.condition = require("../models/condition.model.js")(sequelize, Sequelize);
db.padecimientos_cliente = require("../models/padecimientos_clientes.mode.js")(sequelize, Sequelize);

db.role.hasMany(db.client, { as: "client" });
db.client.belongsTo(db.role, {
  foreignKey: "rolesPruebaRoleid",
  as: "role",
});

db.contact.hasMany(db.client, { as: "client" });
db.client.belongsTo(db.contact, {
  foreignKey: "cConfianzaPruebaIdContactoConfianza",
  as: "contact",
});

db.user.belongsToMany(db.condition, 
                      { through: db.padecimientos_cliente, 
                      foreignKey: 'id_cliente', 
                      otherKey: 'id_padecimiento' });
db.condition.belongsToMany(db.user, 
                          { through: db.padecimientos_cliente, 
                            foreignKey: 'id_padecimiento', 
                            otherKey: 'id_cliente'});

db.user.hasOne(db.client);
db.client.belongsTo(db.user);

db.ROLES = ["user", "pharmacy", "gov"];

module.exports = db;
