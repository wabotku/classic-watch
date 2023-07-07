module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "username"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "password"
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "token"
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt',
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deletedAt'
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "password",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "password" },
        ]
      },
      {
        name: "token",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
};
