module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define("Organization", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    });

    Organization.associate = (models) => {
      Organization.hasMany(models.Tournament, { foreignKey: "organizationId", as: "tournaments" });
    };

    return Organization;
};
