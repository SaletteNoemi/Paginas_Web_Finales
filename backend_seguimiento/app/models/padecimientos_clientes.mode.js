module.exports = (sequelize, Sequelize) => {
    const Padecimientos_cliente = sequelize.define('padecimientos_cliente', {
        id_padecimientos_cliente: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
      }, 
    { timestamps: false });
  
    return Padecimientos_cliente;
  };
  