const mongoose = require("mongoose")



const user = mongoose.Schema({
    id: String,
    identity: Object,
    send_to: {
        type:String,
        default:""
    },
    password: String,
    send_from: Array,
    active: {
        type: Boolean,
        default: true
    },
    can_have_down:{
        type:Boolean,
        default:false
    }

})


module.exports = mongoose.model("User", user)