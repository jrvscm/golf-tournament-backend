const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface) => {
    console.log("Starting database seeding...");

    // Seed Tournaments
    const tournaments = await queryInterface.bulkInsert(
      "Tournaments",
      [
        {
          name: "Spring Championship",
          date: "2024-05-20",
          format: "Stroke Play",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Summer Invitational",
          date: "2024-07-15",
          format: "Match Play",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    console.log("Tournaments seeded successfully!");

    // Seed Players
    const players = await queryInterface.bulkInsert(
      "Players",
      [
        {
          name: "John Doe",
          handicap: 12.5,
          tournamentId: tournaments[0].id, // Assign to first tournament
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Smith",
          handicap: 8.2,
          tournamentId: tournaments[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mark Johnson",
          handicap: 14.0,
          tournamentId: tournaments[1].id, // Assign to second tournament
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    console.log("Players seeded successfully!");

    // Seed Scores
    await queryInterface.bulkInsert("Scores", [
      {
        playerId: players[0].id,
        tournamentId: tournaments[0].id,
        round: 1,
        strokes: 78,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        playerId: players[1].id,
        tournamentId: tournaments[0].id,
        round: 1,
        strokes: 82,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        playerId: players[2].id,
        tournamentId: tournaments[1].id,
        round: 1,
        strokes: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("Scores seeded successfully!");
  },

  down: async (queryInterface) => {
    console.log("Rolling back seed data...");
    await queryInterface.bulkDelete("Scores", null, {});
    await queryInterface.bulkDelete("Players", null, {});
    await queryInterface.bulkDelete("Tournaments", null, {});
  },
};
