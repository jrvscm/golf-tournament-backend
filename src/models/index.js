const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Import models
const UserModel = require("./User");
const TournamentModel = require("./Tournament");
const OrganizationModel = require("./Organization");
const PlayerModel = require("./Player");
const ScoreModel = require("./Score");
const LeaderboardModel = require("./Leaderboard");
const AnnouncementModel = require("./Announcement");
const PaymentModel = require("./Payment");

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Tournament = TournamentModel(sequelize, DataTypes);
const Organization = OrganizationModel(sequelize, DataTypes);
const Player = PlayerModel(sequelize, DataTypes);
const Score = ScoreModel(sequelize, DataTypes);
const Leaderboard = LeaderboardModel(sequelize, DataTypes);
const Announcement = AnnouncementModel(sequelize, DataTypes);
const Payment = PaymentModel(sequelize, DataTypes);

// Define Associations
Organization.hasMany(Tournament, { foreignKey: "organizationId", as: "tournaments" });
Tournament.belongsTo(Organization, { foreignKey: "organizationId", as: "organization" });

User.hasMany(Tournament, { foreignKey: "ownerId", as: "tournaments" });
Tournament.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Tournament.hasMany(Player, { foreignKey: "tournamentId", as: "players" });
Player.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

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
  Organization,
  Player,
  Score,
  Leaderboard,
  Announcement,
  Payment,
};
