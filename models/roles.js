module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    deskripsiPrivilege: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
        ]
      },
    ]
  });
};
