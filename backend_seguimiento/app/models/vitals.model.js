module.exports = (sequelize, Sequelize) => {
    const Vitals = sequelize.define("vital_pruebas", {
      id_lectura: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_cliente: {
        type: Sequelize.INTEGER
      },
      id_local: {
        type: Sequelize.INTEGER
      },
      ritmo_cardiaco: {
        type: Sequelize.INTEGER
      },
      frecuencia_respiratoria: {
        type: Sequelize.INTEGER
      },
      peso: {
        type: Sequelize.FLOAT
      },
      indice_masa_corporal: {
        type: Sequelize.FLOAT
      },
      saturacion_oxigeno: {
        type: Sequelize.INTEGER
      },
      temperatura: {
        type: Sequelize.FLOAT
      },
      presion_sanguinea_sistolica: {
        type: Sequelize.INTEGER
      },
      presion_sanguinea_diastolica: {
        type: Sequelize.INTEGER
      },
      altura: {
        type: Sequelize.FLOAT
      },
      fecha: {
        type: Sequelize.DATE
      }
    },
    { timestamps: false }
    );
  
    return Vitals;
  };