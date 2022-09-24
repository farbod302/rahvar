const express = require('express');
const router = express.Router()
const Psums = require("../db/prv_sums")


router.post("/add_prv_sums", (req, res) => {
    const { mounth, mounth_string, year, token, cods } = req.body

    //conf token

    let _codes = cods.map(code => { return { ...code, remain: code.count } })

    let new_prv = {
        mounth, mounth_string, year, codes: _codes
    }

    new Psums(new_prv).save()

    res.json({
        status: true,
        msg: "رکود ها ثبت شد",
        dara: null
    })

})

router.post("/edit_prv_sums",async (req, res) => {
    const { mounth, year, token, cods } = req.body

    //conf token

    let _codes = cods.map(code => { return { ...code, remain: code.count } })


    await Psums.findOneAndUpdate({ year: year, mounth: mounth }, { $set: { codes: _codes } })


    res.json({
        status: true,
        msg: "رکود ها ویرایش شد",
        dara: null
    })
})






module.exports = router
