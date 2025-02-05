module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "tournament_owner"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'invited'),
      defaultValue: 'pending',
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    organizationId: {
      type: DataTypes.UUID, // Ensure it matches the `Organizations.id` type
      allowNull: true,
      references: {
        model: "Organizations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
  };

  return User;
};
