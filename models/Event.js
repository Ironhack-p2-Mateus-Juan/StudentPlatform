const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: { type: String },
      coordinates: [Number]
    },
    date: { type: String, required: true },
    participants: { type: Object }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

eventSchema.index({location: "2dsphere"});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;