const express = require('express')
const app = express()
const port = 56186
const axios = require('axios');

app.use(express.static('public'))

app.get('/status', async (req, res) => {
    
    let d = await axios.get(`https://miningpoolstats.stream/data/time?t=${new Date().getTime()}`)
    let data1 = await axios.get(`https://data.miningpoolstats.stream/data/ethereum.js?t=${d.data}`)
    let data2 = await axios.get(`https://data.miningpoolstats.stream/data/history/ethereum.js?t=${d.data}`)
    let data3 = await axios.get('https://api.ethermine.org/poolStats')

    console.log(data3.data)
    res.json({
        status: {
            usd: data1.data.price,
            ethHour: data1.data.minerstat[0],
            cny: data3.data.data.price.cny,
            gas: data3.data.data.estimates.gasPrice,
            hashrate: (data1.data.hashrate / 1e12).toFixed(2),
            difficulty: (data1.data.difficulty / 1e15).toFixed(2),
        },
        history: {
            count: data2.data.count,
            price: data2.data.history.price,
            difficulty: data2.data.history.difficulty.map(i => i / 1e15),
            time: data2.data.history.time
        }
    })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
