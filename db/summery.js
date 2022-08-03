const mongoose = require("mongoose")



const summery = mongoose.Schema({
    id: String,
    sender: Object,
    sender_code:String,
    send_to: String,
    date_string: String,
    date: Number,
    encrypted_string:Object

})


module.exports = mongoose.model("Summery", summery)