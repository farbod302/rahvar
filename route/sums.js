const express = require('express')
const Summery = require('../db/summery')
const router = express.Router()
const JDate = require('jalali-date');






router.post("/most", async (req, res) => {

    const { s_date, e_date } = req.body
    let sums = await Summery.find({ date: { $gte: s_date, $lte: e_date } })

    let all_cods = []
    sums.forEach(sum => {
        const { count } = sum.encrypted_string
        count.forEach(c => {
            let index = all_cods.findIndex(e => e.code === c.code)
            if (index === -1) {
                all_cods.push({
                    code: c.code,
                    count: c.count
                })
            }
            else {
                all_cods[index].count += c.count
            }
        })

    })


    all_cods = all_cods.sort((a, b) => { return b.count - a.count })


    res.json({
        sttus: true,
        msg: "",
        data: {
            summery: all_cods.slice(0, 5)
        }
    })


})


router.post("/year",async (req, res) => {

    const { code ,year} = req.body

    const jdate = new JDate(year, 1, 1);
    let new_date = new Date(jdate._d)
    let timestamp = new_date.getTime()
    let each_mount = 1000 * 1 * 60 * 60 * 24 * 30
    let all_dates = []
    for (let i = 1; i <= 12; i++) {
        all_dates.push({
            index:i,
            date: `1401/${i}`,
            s_t: timestamp,
            e_t: timestamp + each_mount
        })
        timestamp += each_mount
    }
    let result = []
    let reqs=all_dates.map(async each => {

        let sums = await Summery.find({ date: { $gte: each.s_t, $lte: each.e_t } })
        let _count = 0
        sums.forEach(sum => {
            const { count } = sum.encrypted_string
            let index = count.findIndex(e => e.code === code)
            if (index === -1) return
            _count += count[index].count
        })
        result.push({
            index:each.index,
            date: each.date,
            count: _count
        })


    })
    await Promise.all(reqs)

    result=result.sort((a,b)=>{return a.index-b.index})

    res.json(result)
})






module.exports = router