import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,                   // unique short code
 
  },
  target_url: {
    type: String,
    required: true,                 // must be provided
  },
  created_at: {
    type: Date,
    default: Date.now              // automatically set
  },
  total_clicks: {
    type: Number,
    default: 0                     // initially zero
  },
  last_clicked_at: {
    type: Date                     // updated after every redirect
  }
},{timestamps:true});

const linkModel = mongoose.model("Link", linkSchema);
export default linkModel