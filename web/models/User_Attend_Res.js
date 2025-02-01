const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Reference to the Event model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  dietary_preferences: {
    type: [String], // Array of dietary preferences (e.g., vegetarian, vegan, gluten-free)
    default: [],
  },
  share_city: {
    type: Boolean,
    required: true,
  },
  travel_pref: {
    type: String,
    required: true,
  },
  tshirt_size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL"], // Standard t-shirt sizes
    required: true,
  },
});

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
