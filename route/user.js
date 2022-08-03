const express = require('express')
const router = express.Router()
const hash = require("short-hash")
const User = require("../db/users")
const jwt = require("jsonwebtoken")
const { uid } = require("uid")


const TrezSmsClient = require("trez-sms-client");
const { jwt_verify } = require('../helper')
const client = new TrezSmsClient("farbod302", process.env.SMS);
router.post("/sign_up", async (req, res) => {

    const { name, lastName, phone, code, send_from, send_to } = req.body
    let is_exist = await User.findOne({ id: code })
    if (is_exist) {
        res.json({
            status: false,
            msg: "کد ملی تکراری",
            data: {}
        })
        return
    }
    let new_user = {
        identity: {
            name, lastName, phone
        },
        id: code,
        send_from,
        send_to,
        password: hash(code)
    }
    new User(new_user).save()
    res.json({
        status: true,
        msg: "کاربر ثبت شد",
        data: {}
    })

})

router.post("/log_in", async (req, res) => {
    const { code, password } = req.body

    let user = await User.findOne({ id: code, password: hash(password) })


    if (!user) {
        res.json({
            status: false,
            msg: "نام کاربری یا پسورد اشتباه است",
            data: {}
        })
        return
    }
    const { name, lastName } = user.identity
    let token = jwt.sign({ name, lastName, code }, process.env.JWT)
    res.json({
        status: true,
        msg: name+" "+lastName,
        data: {
            token
        }
    })
})


router.post("/change_password", async (req, res) => {

    const { code, old_password, new_password } = req.body

    let user = await User.findOne({ id: code, password: hash(old_password) })
    if (!user) {
        res.json({
            status: false,
            msg: "نام کاربری یارمز عبور اشتباه است",
            data: {}
        })
        return
    }
    user.password = hash(new_password)
    user.save()
    res.json({
        status: true,
        msg: "پسورد تغییر کرد",
        data: {}
    })


})



router.post("/forget_password", async (req, res) => {
    const { phone, code } = req.body

    let user = await User.findOne({ "identity.phone": phone, id: code })
    if (!user) {
        res.json({
            status: false,
            msg: "نام کاربری و شماره تماس همخوانی ندارد",
            data: {}
        })
        return
    }
    let new_password = uid(8)
    user.password = hash(new_password)
    user.save()
    let msg = `پسورد جدید شما : ${new_password}`
    client.manualSendCode(phone, msg)
    res.json({
        status: true,
        msg: "پسور جدید به شما پیامک خواهد شد",
        data: {}
    })


})


router.post("/add_down", async (req, res) => {
    const { token, name, lastName, phone, code } = req.body
    let up_user = jwt_verify(token)
    if (!up_user) {
        res.json({
            status: false,
            msg: "شناسه نامعتبر",
            data: {}
        })
        return
    }
    let user = await User.findOne({ cose: up_user.code, can_have_down: true })
    if (!user) {
        res.json({
            status: false,
            msg: "دسترسی محدود",
            data: {}
        })
        return
    }

    let is_exist = await User.findOne({ id: code, active: true })
    if (is_exist) {
        res.json({
            status: false,
            msg: "کاربر از قبلدر سامانه ثبت است",
            data: {}
        })
        return
    }

    await User.findOneAndRemove({ id: code })

    const new_user = {
        identity: {
            name, lastName, phone
        },
        id: code, send_from: [], send_to: up_user.code,password: hash(code)
    }
    await new User(new_user).save()
    await User.findOneAndUpdate({ id: up_user.code }, { $push: { send_from: code } })
    res.json({
        status: true,
        msg: "مادون اضافه شد",
        data: {}
    })

})







module.exports = router