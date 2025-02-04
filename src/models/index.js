const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure this is your DB connection file

// Import models
const UserModel = require("./User");
const TournamentModel = require("./Tournament");
const PlayerModel = require("./Player");
const ScoreModel = require("./Score");
const LeaderboardModel = require("./Leaderboard");
const AnnouncementModel = require("./Announcement");
const PaymentModel = require("./Payment");

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Tournament = TournamentModel(sequelize, DataTypes);
const Player = PlayerModel(sequelize, DataTypes);
const Score = ScoreModel(sequelize, DataTypes);
const Leaderboard = LeaderboardModel(sequelize, DataTypes);
const Announcement = AnnouncementModel(sequelize, DataTypes);
const Payment = PaymentModel(sequelize, DataTypes);

// Define Associations
User.hasMany(Tournament, { foreignKey: "ownerId", as: "tournaments" });
Tournament.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Tournament.hasMany(Player, { foreignKey: "tournamentId", as: "players" });
Player.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

User.hasMany(Player, { foreignKey: "userId", as: "playerProfile" });
Player.belongsTo(User, { foreignKey: "userId", as: "user" });

Player.hasMany(Score, { foreignKey: "playerId", as: "scores" });
Score.belongsTo(Player, { foreignKey: "playerId", as: "player" });

Tournament.hasMany(Score, { foreignKey: "tournamentId", as: "scores" });
Score.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

Leaderboard.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });
Leaderboard.belongsTo(Player, { foreignKey: "playerId", as: "player" });

Announcement.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

Payment.belongsTo(User, { foreignKey: "userId", as: "user" });
Payment.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

// Export models
module.exports = {
  sequelize,
  User,
  Tournament,
  Player,
  Score,
  Leaderboard,
  Announcement,
  Payment,
};
