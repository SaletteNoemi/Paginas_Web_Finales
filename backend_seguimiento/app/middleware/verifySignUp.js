const db = require("../models");
const ROLES = db.ROLES;
const Client = db.client;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    
    // Email
    client = await Client.findOne({
      where: {
        correo: req.body.correo
      }
    });

    if (client) {
      return res.status(400).send({
        message: "El email ya está en uso."
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "El rol no existe: " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
