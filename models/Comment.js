const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Do not set variable names as just "Comment" or "comment" because it's a reserved word!
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
