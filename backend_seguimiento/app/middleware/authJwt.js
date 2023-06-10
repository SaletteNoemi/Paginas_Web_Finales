const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Client = db.client;


verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "¡No se porporcionó un token!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No autorizado!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};


isPharmacy = (req, res, next) => {
  Client.findByPk(req.userId).then(client => {
    client.getRole().then(roles => {
      if (roles.name === "pharmacy") {
            next();
            return;
      }
      res.status(403).send({
        message: "¡Contenido disponible únicamente para la farmacéutica!"
      });
      return;
    });
  });
};


isGov = (req, res, next) => {
  Client.findByPk(req.userId).then(client => {
    client.getRole().then(roles => {
      if (roles.name === "gov") {
            next();
            return;
      }
      res.status(403).send({
        message: "¡Contenido disponible únicamente para el gobierno!"
      });
      return;
    });
  });
};


const authJwt = {
  verifyToken: verifyToken,
  isPharmacy: isPharmacy,
  isGov: isGov
};
module.exports = authJwt;
