module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
      amount: { type: DataTypes.INTEGER, allowNull: false }, // Stored in cents (e.g., $50.00 = 5000)
      status: { type: DataTypes.ENUM("pending", "completed", "failed"), allowNull: false },
    });
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Payment.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" });
    };
  
    return Payment;
  };
  