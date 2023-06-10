const db = require("../models");
const Vitals = db.vitals;
const Client = db.client;
const util = require("node:util")


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cryp = require("../controllers/cryp.controller")

exports.findAllId = async (req, res) => {
  
    const userid = req.params.userid;

    const client = await Client.findOne({ where: { clientesPruebaIdCliente: userid } });

    console.log(client);
    const zc = client.zc;
    const zcPwd = client.zcPwd;
    const derivedKeyPwd = client.derivedKeyPwd;
    const ivPwd = client.ivPwd;
    const saltPrivada = client.saltPrivada;
    const ivUsuario = client.ivUsuario;


    const vital = await Vitals.findAll({
      attributes: [
        `ritmo_cardiaco`, 
        `frecuencia_respiratoria`, `peso`, 
        `indice_masa_corporal`, 
        `saturacion_oxigeno`, `temperatura`,
         `presion_sanguinea_sistolica`, 
        `presion_sanguinea_diastolica`, 
        `altura`,
        `date_time`
      ],
      where: {id_cliente: userid},
      order: [ [ 'date_time', 'DESC' ]] })
        .then(data => {
            const zc1_inverso = cryp.get_sharedSecret(zc, zcPwd, derivedKeyPwd, ivPwd, saltPrivada, ivUsuario);
                for (var i=0; i < data.length; i++){
                  for (const element in data[i].dataValues){
                    if(element != 'date_time'){
                    var dato = data[i].dataValues[element];
                    data[i].dataValues[element] = cryp.desencriptarDato(zc1_inverso,ivUsuario, dato);
                    }
                  }
                }
                  res.send(data);
        }).catch(err => {
            res.status(500).send({
              message:
                err.message || "Sucedió un error al localizar los datos."
            });
          });
  };

exports.findAllIdChart = async (req, res) => {
    const userid = req.params.userid;

    const client = await Client.findOne({ where: { clientesPruebaIdCliente: userid } });

    const zc = client.zc;
    const zcPwd = client.zcPwd;
    const derivedKeyPwd = client.derivedKeyPwd;
    const ivPwd = client.ivPwd;
    const saltPrivada = client.saltPrivada;
    const ivUsuario = client.ivUsuario;


    const vital = await Vitals.findAll({
      attributes: [
        `ritmo_cardiaco`, 
        `frecuencia_respiratoria`, 
        `peso`, 
        `indice_masa_corporal`, 
        `saturacion_oxigeno`, `temperatura`,
        `presion_sanguinea_sistolica`
      ],
      where: {id_cliente: userid},
      order: [ [ 'date_time', 'DESC' ]] })
        .then(data => {
          const zc1_inverso = cryp.get_sharedSecret(zc,zcPwd,derivedKeyPwd,ivPwd,saltPrivada,ivUsuario);
                for (var i=0; i < data.length; i++){
                  for (const element in data[i].dataValues){
                    var dato = data[i].dataValues[element];
                    data[i].dataValues[element] = cryp.desencriptarDato(zc1_inverso,ivUsuario,dato);
                  }
                }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Sucedió un error al localizar los datos."
            });
          });
  };