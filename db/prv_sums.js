const mongoose = require("mongoose")



const psums = mongoose.Schema({
    date_string: String,
    year: Number,
    mounth: Number,
    mounth_string: String,
    cods: Array,
    user:Array

})


module.exports = mongoose.model("Psums", psums)