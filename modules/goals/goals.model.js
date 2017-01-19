"use strict";

require("rootpath")();

const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const timestamps = require("mongoose-timestamp");
const paginate = require("mongoose-paginate");
const winston = require("winston");

let goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  hashtags: {
    type: Array,
    default: []
  },
  location: {
    type: String,
    default: ""
  },
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
  completed: {
    status: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date
    }
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
});

goalSchema.pre("save", function (next) {
  let goal = this;
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

goalSchema.set("toObject", {
  virtuals: true,
  getters: true
});

goalSchema.set("toJSON", {
  virtuals: true
});

goalSchema.plugin(timestamps);
goalSchema.plugin(paginate);

module.exports = mongoose.model("Goal", goalSchema);