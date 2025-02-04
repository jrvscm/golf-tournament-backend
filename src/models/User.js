module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      fullName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM("admin", "tournament_owner", "player"), allowNull: false },
    });
  
    User.associate = (models) => {
      User.hasMany(models.Tournament, { foreignKey: "ownerId", as: "tournaments" });
      User.hasMany(models.Player, { foreignKey: "userId", as: "playerProfile" });
    };
  
    return User;
  };
  