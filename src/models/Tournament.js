module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define("Tournament", {
    name: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    format: { type: DataTypes.STRING, allowNull: false },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Organizations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  Tournament.associate = (models) => {
    Tournament.belongsTo(models.Organization, { foreignKey: "organizationId", as: "organization" });
    Tournament.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });
    Tournament.hasMany(models.Player, { foreignKey: "tournamentId", as: "players" });
    Tournament.hasMany(models.Score, { foreignKey: "tournamentId", as: "scores" });
    Tournament.hasMany(models.Leaderboard, { foreignKey: "tournamentId", as: "leaderboard" });
    Tournament.hasMany(models.Announcement, { foreignKey: "tournamentId", as: "announcements" });
    Tournament.hasMany(models.Payment, { foreignKey: "tournamentId", as: "payments" });
  };

  return Tournament;
};
