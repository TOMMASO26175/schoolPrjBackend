import mongoose from "mongoose";
var Schema = mongoose.Schema;

var subscriptions = new Schema({
  renewalDate: {
    type: Date,
    default: null,
  },

  type: {
    type: Object,
    default: null,
  },
});

export default mongoose.model("Subscriptions", subscriptions);
