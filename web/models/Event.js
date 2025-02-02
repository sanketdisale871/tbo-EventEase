const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // userID: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // Reference to the User model
  //   required: true,
  // },
  // companyName: {
  //   type: String,
  //   required: true,
  // },
  // eventTitle: {
  //   type: String,
  //   required: true,
  // },
  // eventNoOfDays: {
  //   type: Number,
  //   required: true,
  // },
  // startDate: {
  //   type: Date,
  //   required: true,
  // },
  // endDate: {
  //   type: Date,
  //   required: true,
  // },
  // noOfPeopleJoining: {
  //   type: Number,
  //   required: true,
  // },
  // ageGroup: {
  //   type: String,
  //   required: true,
  //   match: /^\d{1,3}-\d{1,3}$/, // format is like "20-25"
  // },
  // eventLink: {
  //   type: String,
  //   required: true,
  // },
  // description: {
  //   type: String,
  //   required: true,
  // },
  // deadline: {
  //   type: Date,
  //   required: true,
  // },
  owner_id: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  event_title: {
    type: String,
    required: true,
  },
  number_of_days: {
    type: Number,
    required: true,
  },
  date_range: {
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  location: {
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  budget: {
    currency: {
      type: String,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    breakdown: {
      accommodation: {
        type: Number,
        required: true,
      },
      food: {
        type: Number,
        required: true,
      },
      venue: {
        type: Number,
        required: true,
      },
      miscellaneous: {
        type: Number,
        required: true,
      },
    },
  },
  hotel_details: {
    is_accommodation_required: {
      type: Boolean,
      required: true,
    },
    hotel_quality: {
      type: String,
    },
    hotel_name: {
      type: String,
    },
    hotel_characteristics: {
      type: [String],
    },
    hotel_id: {
      type: String,
    },
    check_in_time: {
      type: String,
    },
    check_out_time: {
      type: String,
    },
    is_auditorium_required: {
      type: Boolean,
    },
    is_wifi_required: {
      type: Boolean,
    },
    price: {
      currency: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },
    auditorium_capacity: {
      type: Number,
    },
  },
  food_arrangements: {
    is_food_required: {
      type: Boolean,
      required: true,
    },
    dietary_restrictions: {
      type: [String],
    },
    meal_schedule: {
      breakfast: {
        start_time: {
          type: String,
        },
        end_time: {
          type: String,
        },
      },
      lunch: {
        start_time: {
          type: String,
        },
        end_time: {
          type: String,
        },
      },
      dinner: {
        start_time: {
          type: String,
        },
        end_time: {
          type: String,
        },
      },
    },
  },
  schedule: [
    {
      date: {
        type: Date,
        required: true,
      },
      day_number: {
        type: Number,
        required: true,
      },
      time_table: [
        {
          activity: {
            type: String,
            required: true,
          },
          details: {
            type: String,
          },
          start_time: {
            type: String,
            required: true,
          },
          end_time: {
            type: String,
            required: true,
          },
          location: {
            type: String,
          },
        },
      ],
    },
  ],
  miscellaneous: {
    dress_code: {
      type: String,
    },
    event_hashtag: {
      type: String,
    },
    other_notes: {
      type: [String],
    },
  },
  weather: {
    type: String,
  },
  nearby_tourist_spots: [
    {
      venue_name: {
        type: String,
        required: true,
      },
      details: {
        type: String,
      },
      venue_distance_from_location: {
        type: String,
      },
    },
  ],
  ongoing_festivals: {
    type: [String],
  },
  attendees: {
    type: [String],
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
