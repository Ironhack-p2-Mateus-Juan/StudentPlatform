const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    type: { type: String, default: "Event" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: { type: String },
      coordinates: [Number]
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    eventId: { type: String },
    imagePath: { type: String }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
