'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workspace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Workspace.belongsTo(models.WorkspaceType, { foreignKey: 'workspace_type_id' });
      Workspace.belongsTo(models.User, { foreignKey: 'user_id' });
      Workspace.hasMany(models.WorkspaceService, { foreignKey: 'workspace_id' });
      Workspace.hasMany(models.Attachment, { foreignKey: 'type_id' });
    }
  };
  Workspace.init({
    name: DataTypes.STRING,
    workspace_type_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    price: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    max_capacity: DataTypes.INTEGER,
    min_capacity: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Workspace',
  });
  return Workspace;
};
