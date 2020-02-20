var express = require('express');
var router = express.Router();
const axios = require("axios");
const NASA_KEY = "zXNaKE8fo0wNYalgcqNt0yOWG9rdk5vuNLH4H7gd";

function setDateFromString(date, dateString) {
  // ubstring(5, 7)), parseInt(dateString.substring(8, 10)), parseInt(dateString.substring(11, 13)), parseInt(dateString.substring(14, 16)), parseInt(dateString.substring(17, 19)))
  date.setFullYear(parseInt(dateString.substring(0, 4)));
  date.setMonth(parseInt(dateString.substring(5, 7)));
  date.setDate(parseInt(dateString.substring(8, 10)));
  date.setHours(parseInt(dateString.substring(11, 13)));
  date.setMinutes(parseInt(dateString.substring(14, 16)));
  date.setSeconds(parseInt(dateString.substring(17, 19)));
  return date;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  axios({
    baseURL: 'https://api.nasa.gov/',
    method: "get",
    url: "insight_weather/?api_key=" + NASA_KEY + "&feedtype=json&ver=1.0"
  }).then(response => {
    let solList = response.data.sol_keys.sort();
    let solsData = {};
    solList.forEach(sol => {
      solsData[sol] = Object.assign({}, response.data[sol]);
      solsData[sol].date = new Date();
      setDateFromString(solsData[sol].date, response.data[sol]["First_UTC"])
      console.log(solsData[sol].date);
    });
    res.render('allSols', { page: "Last Seven Sols", sols: solList, solsData: solsData })
  }).catch((err) => console.error())
});

module.exports = router;