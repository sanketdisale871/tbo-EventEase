const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const Event = require("../models/Event");
const Itinerary = require("../models/Itinerary");
const AttenRes = require("../models/User_Attend_Res");

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

    if (user) {
      if (user.role === "Attendee") {
        return res.render("user_dashboard", {
          user,
        });
      } else {
        return res.render("dashboard", {
          user,
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
};

// Liabilities
