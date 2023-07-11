module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cw_m_product', {
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    uuidMerchant: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    namaMerchant: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tahun: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    uuidMerk: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    namaMerk: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    noSeri: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kelengkapan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'cw_m_product',
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
    ]
  });
};
