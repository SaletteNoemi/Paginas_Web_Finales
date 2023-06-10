module.exports = (sequelize, Sequelize) => {
    const Padecimiento = sequelize.define("padecimiento", {
      id_padecimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      padecimiento: {
        type: Sequelize.STRING
      },
      desc_padecimiento: {
        type: Sequelize.STRING
      }
    },
    { timestamps: false }
    );
  
    return Padecimiento;
  };
  