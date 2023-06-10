module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles_pruebas", {
    roleid: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return Role;
};
