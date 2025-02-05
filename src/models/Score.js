module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define("Score", {
    round: { type: DataTypes.INTEGER, allowNull: false },
    strokes: { type: DataTypes.INTEGER, allowNull: false },
  });

  Score.associate = (models) => {
    Score.belongsTo(models.Player, { foreignKey: "playerId", as: "player" });
    Score.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" });
  };

  return Score;
};
