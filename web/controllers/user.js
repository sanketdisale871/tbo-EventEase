const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const Event = require("../models/Event");
const Itinerary = require("../models/Itinerary");
const AttenRes = require("../models/User_Attend_Res");
const nodemailer = require('nodemailer');


// create json web token
const maxAge = 1000 * 365 * 24 * 60 * 60;

const createUserToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// POST /api/register
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      repassword,
      phone,
      role,
      companyName,
      designation,
      country,
    } = req.body;

    console.log(req.body);

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !role ||
      !companyName ||
      !designation
    ) {
      console.log("Here, Invalid Req");
      return res.render("register", { errMsg: "Invalid request!" });
    }
    if (password !== repassword) {
      return res.render("register", {
        errMsg: "Password & Confirm Password not match!",
      });
    }
    await User.init(); // Ensure indexes are built before creating a new user

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds value

    const new_user = new User({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      repassword: hashedPassword,
      phone,
      role,
      companyName,
      designation,
      country,
      eventReg: 0, // Fix typo from eventRge to eventReg
    });

    await new_user.save(); // Save the new user and wait for the result

    // // If login is successful, generate a token
    const token = createUserToken(new_user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("register", { errMsg: err.message });
  }
};

// POST /api/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    // If login is successful, generate a token
    const token = createUserToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("login", { errMsg: err.message });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};

const renderDashboard = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    let upcomingEvents = 0;
    let eventReg = user.events.length;

    for (let i = 0; i < user.events.length; i++) {
      if (user.events[i].date > new Date()) {
        upcomingEvents++;
      }
    }

    if (user) {
      if (user.role === "Attendee") {
        return res.render("user_dashboard", {
          user,
          upcomingEvents,
          eventReg,
        });
      } else {
        return res.render("dashboard", {
          user,
          upcomingEvents,
          eventReg,
        });
      }
    }
    return res.render("login", { errMsg: "Account not found!" });
  } catch (err) {
    console.log(err);
    res.render("login", { errMsg: err.message });
  }
};

const renderLogin = async (req, res) => {
  res.render("login", { errMsg: null });
};
const renderRegister = async (req, res) => {
  res.render("register", { errMsg: null });
};

// const renderChat = async (req, res) => {
//   res.render("chat_updated", { User });
// };

const renderChat = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (user) {
      return res.render("chat_updated", { user });
    }
    return res.render("login", { errMsg: "Account not found!" });
  } catch (err) {
    console.log(err);
    res.render("login", { errMsg: err.message });
  }
};

const renderItinerary = async (req, res) => {
  try {
    const itineraryId = req.params.itineraryid;
    if (!itineraryId) {
      return res.status(400).send("Itinerary ID is required");
    }

    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).send("Itinerary not found");
    }

    res.render("itinerary", { itinerary });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching itinerary");
  }
};

const renderEvent = async (req, res) => {
  try {

    const userId = req.userId;
    console.log(userId);
    const eventId = req.params.eventid;
    if (!eventId) {
      return res.status(400).send("Event ID is required");
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send("Event not found");
    }

    const is_registered = event.attendees.includes(userId);

    res.render("event", { event, is_registered });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching event");
  }
};

const publishEvent = async (req, res) => {
  try {
    const { _id } = req.body;
    const itinerary = await Itinerary.findById(_id);

    console.log(itinerary.event_title);

    if (!itinerary) {
      return res.status(404).send("Itinerary not found");
    } else {
      await Event.init();

      const new_event = new Event({
        company_name: itinerary.company_name,
        owner_id: itinerary.owner_id,
        event_title: itinerary.event_title,
        number_of_days: itinerary.number_of_days,
        date_range: itinerary.date_range,
        location: itinerary.location,
        budget: itinerary.budget,
        hotel_details: itinerary.hotel_details,
        food_arrangements: itinerary.food_arrangements,
        schedule: itinerary.schedule,
        miscellaneous: itinerary.miscellaneous,
        weather: itinerary.weather,
        nearby_tourist_spots: itinerary.nearby_tourist_spots,
        ongoing_festivals: itinerary.ongoing_festivals,
      });
      // new_event.itineraryDetails = itinerary;

      await new_event.save();
      console.log("Event published successfully");
      res.redirect(`/event/${new_event._id}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error publisj=hing ebent");
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const userId = req.userId;
    console.log(userId);
    console.log(event_id);

    const event = await Event.findById(event_id);
    const user = await User.findById(userId);

    if (!event.hasOwnProperty("attendees")) {
      event["attendees"] = [userId];
    } else if (event["attendees"].includes(userId)) {
      return res.status(400).send("User already registered for event");
    } else {
      event["attendees"].push(userId);
    }

    await event.save();

    sendEmail(user.email);

    res.redirect(`/event/${event_id}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error registering for event");
  }
};

const sendEmail = (receiverEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,

    to: receiverEmail,
    subject: 'Your itinerary for the event',
    text: 'Itinerary here',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// ::::::::::::::::::::::;;;; Chat bot End;;;;;;;;::::::::::::
module.exports = {
  renderDashboard,
  renderLogin,
  renderRegister,
  register,
  login,

  logout,
  renderChat,
  renderItinerary,
  publishEvent,
  renderEvent,
  registerForEvent,
};

// Liabilities
