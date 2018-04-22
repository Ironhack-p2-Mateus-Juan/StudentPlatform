const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    type: { type: String, default:"Event" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
