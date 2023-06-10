module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users_pruebas", {
      userid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      correo: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      saltPrivada: {
        type: Sequelize.STRING
      },
      keyPrivada: {
        type: Sequelize.STRING
      },
      ivUsuario: {
        type: Sequelize.STRING
      },
      zc: {
        type: Sequelize.STRING
      },
      saltPwd: {
        type: Sequelize.STRING
      },
      derivedKeyPwd: {
        type: Sequelize.STRING
      },
      ivPwd: {
        type: Sequelize.STRING
      },
      zcPwd: {
        type: Sequelize.STRING
      },
      saltEmail: {
        type: Sequelize.STRING
      },
      derivedKeyEmail: {
        type: Sequelize.STRING
      },
      ivEmail: {
        type: Sequelize.STRING
      },
      zcEmail: {
        type: Sequelize.STRING
      },
      saltPregunta: {
        type: Sequelize.STRING
      },
      derivedKeyPregunta: {
        type: Sequelize.STRING
      },
      ivPregunta: {
        type: Sequelize.STRING
      },
      zcPregunta: {
        type: Sequelize.STRING
      },
      
    },
    { timestamps: false }
    );
  
    return User;
  };
  
  