const bcrypt = require("bcrypt");
const { sequelize } = require("./src/models"); // Import Sequelize instance
const { v4: uuidv4 } = require("uuid"); // Import UUID

(async () => {
  try {
    console.log("🌱 Running database seed...");

    // Ensure database is synced before seeding (force: true drops existing tables)
    await sequelize.sync({ force: true });
    console.log("🔄 Database schema recreated.");

    const queryInterface = sequelize.getQueryInterface(); // Get query interface from Sequelize

    // 🔹 Seed Organizations (First)
    await queryInterface.bulkInsert("Organizations", [
      {
        id: uuidv4(),
        name: "Elite Golf Club",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Pro Golfers Association",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted Organizations
    const organizations = await queryInterface.sequelize.query(
      `SELECT id FROM "Organizations";`,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log("✅ Organizations seeded successfully!");

    // 🔹 Seed Tournament Owners (Second)
    const hashedPassword = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        fullName: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        organizationId: organizations[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "John Doe",
        email: "johndoe@example.com",
        password: hashedPassword,
        role: "tournament_owner",
        organizationId: organizations[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✅ Users seeded successfully!");

    // 🔹 Seed Tournaments (Third)
    await queryInterface.bulkInsert("Tournaments", [
      {
        name: "Spring Championship",
        date: "2024-05-20",
        format: "Stroke Play",
        organizationId: organizations[0].id,
        ownerId: 1, // Assuming sequential IDs (fix later if needed)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Summer Invitational",
        date: "2024-07-15",
        format: "Match Play",
        organizationId: organizations[1].id,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✅ Tournaments seeded successfully!");

    console.log("🎉 Database seeding completed!");
    process.exit(0); // Exit on success
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1); // Exit on failure
  }
})();
