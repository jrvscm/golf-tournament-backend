module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define("Announcement", {
      message: { type: DataTypes.TEXT, allowNull: false },
    });
  
    Announcement.associate = (models) => {
      Announcement.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" });
    };
  
    return Announcement;
  };
  