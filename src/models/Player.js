module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define("Player", {
    name: { type: DataTypes.STRING, allowNull: false },
    handicap: { type: DataTypes.FLOAT, allowNull: false },
  });

  Player.associate = (models) => {
    Player.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" });
    Player.hasMany(models.Score, { foreignKey: "playerId", as: "scores" });
  };

  return Player;
};
