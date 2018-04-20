const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new Schema(
  {
    users: { type: Object, required: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Participant = mongoose.model("Participant", participantSchema);
module.exports = Participant;
