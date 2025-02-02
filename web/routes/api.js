const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

const userController = require("../controllers/user");
const { requireUserAuth } = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/itinerary/:itineraryid", userController.renderItinerary);
router.get("/logout", requireUserAuth, userController.logout);

router.get("/download", async (req, res) => {
  try {
    // Fetch all events from MongoDB
    console.log("Fetched events:");
    const events = await Event.find();
    console.log("Fetched events:", events);

    if (events.length === 0) {
      return res.status(404).send("No events found.");
    }

    // Define CSV file path
    const csvFilePath = path.join(__dirname, "events.csv");
    console.log("CSV file path:", csvFilePath);

    // Extract keys dynamically for CSV headers
    const headers = Object.keys(events[0]._doc).map((key) => ({
      id: key,
      title: key,
    }));
    console.log("CSV headers:", headers);

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: headers,
    });

    // Write event records to CSV
    await csvWriter.writeRecords(events.map((event) => event.toObject()));
    console.log("CSV file has been written successfully");

    // Send file for download
    res.download(csvFilePath, "events.csv", (err) => {
      if (err) {
        console.error("Download Error:", err);
        return res.status(500).send("Error downloading the file");
      }
      // Delete file after download
      fs.unlinkSync(csvFilePath);
      console.log("CSV file deleted after download");
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
