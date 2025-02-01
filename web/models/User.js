const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  repassword: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  eventReg: {
    type: Number,
  },
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    //   const auth = password == client.password;
    if (auth) {
      return user;
    }
    //   throw Error('incorrect password');
    return null;
  }
  // throw Error('incorrect email');
  return null;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
