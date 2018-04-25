const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCommentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const userComment = mongoose.model("userComment", userCommentSchema);
module.exports = userComment;
