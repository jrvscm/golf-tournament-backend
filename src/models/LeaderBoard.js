module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define("Leaderboard", {
    rank: { type: DataTypes.INTEGER, allowNull: false },
  });

  Leaderboard.associate = (models) => {
    Leaderboard.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" });
    Leaderboard.belongsTo(models.Player, { foreignKey: "playerId", as: "player" });
  };

  return Leaderboard;
};
