const express = require('express');
const Summery = require('../db/summery');
const User = require('../db/users');
const router = express.Router()
const { jwt_verify } = require("../helper")




router.post("/today", async (req, res) => {

    const { token } = req.body

    let user = jwt_verify(token)
    if (!user) {
        res.json({
            status: false,
            msg: "شناسه نا معتبر",
            data: {}
        })
        return
    }

    let s_user = await User.findOne({ code: user.code })
    const { send_from } = s_user

    let today = new Date
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    let timestamp = today.getTime()


    let all_sums = []

    let requests = send_from.map(async down => {
        let sum = await Summery.findOne({ sender_code: down, date: timestamp })
        if (sum) {
            all_sums.push({
                user: sum.sender,
                summery: sum.encrypted_string
            })
        }
        else {
            let not_send = await User.findOne({ id: down })
            all_sums.push({
                user: not_send?.identity || null,
                summery: null
            })
        }
        return
    })
    await Promise.all(requests)
    res.json({
        status: true,
        msg: "",
        data: all_sums
    })

})



router.post("/specified", async (req, res) => {
    const { token, code } = req.body

    let up_user = jwt_verify(token)

    if (!up_user) {
        res.json({
            status: false,
            msg: "شناسه نا معتبر",
            data: {}
        })
        return
    }

    let s_user = await User.findOne({ id: up_user.code })
    if (!s_user.send_from.includes(code)) {
        res.json({
            status: false,
            msg: "این کاربر مادون شما نمی باشد",
            data: {}
        })
        return
    }

    let summeryes = await Summery.find({ sender_code: code }, { encrypted_string: 1, date: 1, date_string: 1 })
    res.json({
        status: true,
        msg: "",
        data: summeryes
    })

})


router.post("/remove", async (req, res) => {
    const { token, code } = req.body
    let up_user = jwt_verify(token)

    if (!up_user) {
        res.json({
            status: false,
            msg: "شناسه نا معتبر",
            data: {}
        })
        return
    }

    let s_user = await User.find({ code: up_user.code })
    if (!s_user.send_from.includes(code)) {
        res.json({
            status: false,
            msg: "این کاربر مادون شما نمی باشد",
            data: {}
        })
        return
    }

    await User.findOneAndUpdate({ code: code }, { $set: { active: false } })
    await User.findOneAndUpdate({ code: up_user.code }, { $pull: { send_from: code } })


})


router.post("/compare", async (req, res) => {

    const { code, start, end, c_start, c_end } = req.body

    let summerys_1 = await Summery.find({ date: { $gte: start, $lte: end } })
    let summerys_2 = await Summery.find({ date: { $gte: c_start, $lte: c_end } })

    let sum_1_filtered = 0,
        sum_2_filtered = 0

    summerys_1.forEach(sum => {

        const { count } = sum.encrypted_string
        let s_count = count.find(c => c.code == code)
        console.log(s_count);
        if (s_count) {
            sum_1_filtered += s_count.count
        }

    })
    summerys_2.forEach(sum => {

        const { count } = sum.encrypted_string
        let s_count = count.find(c => c.code == code)
        if (s_count) {
            sum_2_filtered += s_count.count
        }

    })


    res.json({
        status: true,
        msg: "",
        data: {
            sum_1_count: sum_1_filtered,
            sum_2_count: sum_2_filtered,
            sum_1_totla_sum: summerys_1.length,
            sum_2_totla_sum: summerys_2.length
        }
    })

})


router.post("/list", async (req, res) => {
    const { token } = req.body

    let user = jwt_verify(token)
    if (!user) {
        res.json({
            status: false,
            msg: "شناسه نا معتبر",
            data: {}
        })
        return
    }
    const { code } = user
    console.log(code);
    let s_user = await User.findOne({ id: code })

    let list = await User.find({ id: { $in: s_user.send_from } })
    res.json({
        status: true,
        msg: "",
        data: {
            list
        }
    })

})



module.exports = router


