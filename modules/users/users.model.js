"use strict";

require("rootpath")();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const validate = require("mongoose-validator");
const timestamps = require("mongoose-timestamp");
const paginate = require("mongoose-paginate");
const winston = require("winston");

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    lowercase: true,
    unique: true,
    required: "Email is required.",
    validate: [
      validate({
        validator: "isEmail",
        message: "Email format invalid."
      }),
      validate({
        validator: "isLength",
        arguments: 3,
        message: "Email length too short."
      })
    ]
  },
  password: {
    type: String,
    required: true,
    validate: [
      validate({
        validator: "isLength",
        arguments: [6, 255],
        message: "password must be at least 6 characters"
      })
    ]
  },
  goals: {
    type: Array,
    default: []
  },
  tokens: {
    type: Array
  },
  roles: {
    type: Array,
    default: ["basic"]
  },
  profile: {
    media: {
      preferUpload: {
        type: Boolean,
        default: true
      },
      url: {
        type: String
      },
      img: {
        data: Buffer,
        contentType: String
      }
    },
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: "Name required.",
      validate: [
        validate({
          validator: "contains",
          arguments: " ",
          message: "Full name required."
        }),
        validate({
          validator: "isLength",
          arguments: 3,
          message: "Name is too short."
        })
      ]
    },
    gender: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    joined: {
      type: Date,
      default: new Date()
    }
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

userSchema.methods.comparePassword = function (password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, res) {
    if (res) {
      user.lastLoggedIn = Date.now();
      user.save(function (err) {
        if (err) {
          winston.error(JSON.stringify(err));
        }
      })
    }
    callback(err, res);
  })
}

userSchema.pre("save", function (next) {
  mongoose.models.User.findOne({
    email: this.email
  }, function (err, user) {
    if (user) {
      next(new Error("user", "Email already in use."));
    } else {
      next();
    }
  });
});

userSchema.pre("save", function (next) {
  let user = this;
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    user.password = bcrypt.hashSync(user.password, salt);
    next();
  });
});

userSchema.set("toObject", {
  virtuals: true,
  getters: true
});

userSchema.set("toJSON", {
  virtuals: true
});

userSchema.virtual("firstName").get(function () {
  return this.profile.name.split(" ")[0]
});

userSchema.virtual("lastName").get(function () {
  return this.profile.name.split(" ").slice(1).join(" ")
});

userSchema.pre("validate", function (next) {
  let self = this;
  if (typeof self.email === "string") {
    self.email = self.email.trim();
  }
  if (typeof self.profile.name === "string") self.profile.name = self.profile.name.trim()
  next();
});

userSchema.plugin(timestamps);
userSchema.plugin(paginate);

module.exports = mongoose.model("User", userSchema);