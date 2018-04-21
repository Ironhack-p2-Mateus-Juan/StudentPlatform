const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["Post", "Event"], required: true },
    content: { type: Object, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    imagePath: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
