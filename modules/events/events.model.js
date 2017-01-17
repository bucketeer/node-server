"use strict";

require("rootpath")();

const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const timestamps = require("mongoose-timestamp");
const paginate = require("mongoose-paginate");

let eventSchema = new mongoose.Schema({
  groupId: {
    type: String,
    index: true
  },
  type: {
    type: String,
    index: true,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  success: {
    type: Boolean
  }
});

eventSchema.pre("save", function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdat) {
        this.createdAt = currentDate;
    }
    next();
});

eventSchema.set("toObject", {
  virtuals: true,
  getters: true
});

eventSchema.set("toJSON", {
  virtuals: true
});

eventSchema.plugin(timestamps);
eventSchema.plugin(paginate);

module.exports = mongoose.model("Event", eventSchema);