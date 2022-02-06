import mongoose from "mongoose";
var Schema = mongoose.Schema

var subscriptions = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true,"That user does not exists"]
    },

    renewalDate: {
        type: Date,
        default: null
    },

    paid:{
        type: Boolean,
        default: null
    },

    type:{
        type: Object,
        default:null
    }
})


export default mongoose.model('Subscriptions',subscriptions)