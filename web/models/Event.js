const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  eventNoOfDays: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  noOfPeopleJoining: {
    type: Number,
    required: true,
  },
  ageGroup: {
    type: String,
    required: true,
    match: /^\d{1,3}-\d{1,3}$/, // format is like "20-25"
  },
  eventLink: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
