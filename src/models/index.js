const User = require("./User");
const Tournament = require("./Tournament");
const Player = require("./Player");
const Score = require("./Score");
const Leaderboard = require("./Leaderboard");
const Announcement = require("./Announcement");
const Payment = require("./Payment");

// Define associations

// 🏌️ Users can own multiple tournaments
User.hasMany(Tournament, { foreignKey: "ownerId", as: "tournaments" });
Tournament.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// 🏆 Tournaments have many players
Tournament.hasMany(Player, { foreignKey: "tournamentId", as: "players" });
Player.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

// 🎮 Users can be linked to players
User.hasMany(Player, { foreignKey: "userId", as: "playerProfile" });
Player.belongsTo(User, { foreignKey: "userId", as: "user" });

// ⛳ Players have many scores
Player.hasMany(Score, { foreignKey: "playerId", as: "scores" });
Score.belongsTo(Player, { foreignKey: "playerId", as: "player" });

// 🏅 Tournaments have multiple scores
Tournament.hasMany(Score, { foreignKey: "tournamentId", as: "scores" });
Score.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

// 📊 Leaderboard tracks player rankings
Leaderboard.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });
Leaderboard.belongsTo(Player, { foreignKey: "playerId", as: "player" });

// 📢 Announcements for tournaments
Announcement.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

// 💳 Payments related to tournaments
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });
Payment.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

// Export all models
module.exports = {
  User,
  Tournament,
  Player,
  Score,
  Leaderboard,
  Announcement,
  Payment,
};
