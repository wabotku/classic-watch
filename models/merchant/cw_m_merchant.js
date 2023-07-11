module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cw_m_merchant', {
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "nama"
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    totalUlasan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    idVerifikator: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urlMou: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    totalProduk: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isTester: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'cw_m_merchant',
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
      {
        name: "uuid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
        ]
      },
      {
        name: "nama",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nama" },
        ]
      },
    ]
  });
};
