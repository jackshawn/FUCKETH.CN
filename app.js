const express = require('express')
const app = express()
const port = 56186
const axios = require('axios');

app.use(express.static('public'))

let history = {}

app.get('/status', async (req, res) => {

    let d = await axios.get(`https://miningpoolstats.stream/data/time?t=${new Date().getTime()}`);
    let { data } = await axios.get(`https://data.miningpoolstats.stream/data/ethereum.js?t=${d.data}`)

    res.json({
        usd: data.price,
        ethHour: data.minerstat[0],
        hashrate: (data.hashrate / 1e12).toFixed(2),
        difficulty: (data.difficulty / 1e15).toFixed(2),
    })
})

app.get('/history', async (req, res) => {

    let date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`

    // 存在内存中
    if (history[date]) {
        res.json(history[date])
    } else {
        history = {}

        // get
        let d = await axios.get(`https://miningpoolstats.stream/data/time?t=${new Date().getTime()}`);
        let { data } = await axios.get(`https://data.miningpoolstats.stream/data/history/ethereum.js?t=${d.data}`)
        let result = {
            count: data.count,
            price: data.history.price,
            difficulty: data.history.difficulty.map(i => i / 1e15),
            time: data.history.time
        }

        history[date] = result;
        res.json(result)
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
