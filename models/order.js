'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.Workspace, { foreignKey: 'workspace_id' });
    }
  };
  Order.init({
    capacity: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL,
    user_id: DataTypes.INTEGER,
    workspace_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['unpaid', 'pending', 'paid', 'rejected']
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
