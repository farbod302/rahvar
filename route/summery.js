const express = require('express')
const { jwt_verify, encrypt } = require('../helper')
const router = express.Router()
const User = require("../db/users")
const Summery = require("../db/summery")
const JDate = require('jalali-date');
const Psum = require("../db/prv_sums")

const { uid } = require('uid')
const e = require('express')
const socket_users = require('../socket_users')





router.post("/new_summery", async (req, res) => {
    const { token, summery, accident, stop } = req.body
    let user_id = jwt_verify(token)
    if (!user_id) {
        res.json({
            status: false,
            msg: "توکن نامعتبر",
            data: {}
        })
        return
    }
    const { code, send_to } = user_id
    let user = await User.findOne({ id: code })
    if (user.active === false) {
        res.json({
            status: false,
            msg: "کاربر غیر فعال است",
            data: {}
        })
        return
    }
    const { identity, send_to } = user

    let date = new Date
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    let timestamp = date.getTime()

    //disable check

    let is_exist = await Summery.findOne({ sender_code: code, date: timestamp })
    if (is_exist) {
        res.json({
            status: false,
            msg: "گزارش امروز شما قبلا ارسال شده",
            data: {}
        })
        return
    }
    let count = []
    summery.forEach(element => {

        let index = count.findIndex(each => each.code === element.code)
        if (index < 0) {

            count.push({
                code: element.code,
                count: element.count || 1
            })
        }
        else {
            count[index].count += element.count || 1
        }

    });

    let summery_for_encrypt = {
        count,
        summery,
        accident: accident || 0,
        stop: stop || { car: 0, motor: 0 }
    }

    let encrypted_string = encrypt(summery_for_encrypt)

    let new_sum = {
        id: uid(5),
        sender: identity,
        sender_code: code,
        send_to: send_to,
        date_string: date,
        date: timestamp,
        encrypted_string: summery_for_encrypt
    }
    new Summery(new_sum).save()
    res.json({
        status: true,
        msg: "درخواست ثبت شد",
        data: {}

    })



    const jdate = new JDate();
    let mounth = jdate.date[1]
    let year = jdate.date[0]

    let befor_update = await Psum.findOne({ mounth: mounth, year: year })
    if (!befor_update) return
    let codes = befor_update.codes
    count.forEach(p => {
        let index = codes.findIndex(e => e.code === p.code)
        if (index > -1) {
            codes[index] -= p.count
        }
    })

    await Psum.findOneAndUpdate({ mounth: mounth, year: year }, { $set: { codes: codes } })

    if (!send_to || send_to === "") return
    let socket_id = socket_users.find_user(send_to)
    if (socket_id) {
        let io = req.app.get("io")
        io.to(socket_id).emit("notif", "notif")
    }


})

module.exports = router