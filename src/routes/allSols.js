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

async function getTotalPages(solNum) {
  let response = await axios("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=" + solNum + "&api_key=" + NASA_KEY);
  return await response.data.photos.length;
}

<<<<<<< HEAD
/* GET home page. */
=======

>>>>>>> done with UI
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
    });
    res.render('allSols', { page: "Last Seven Sols", sols: solList, solsData: solsData })
  }).catch((err) => {
    res.status(500).send(err ? err : "Internal Server Error");
  })
});

<<<<<<< HEAD
/* GET users listing. */
router.get('/:solNum/:pageNumber', function (req, res, next) {
=======

router.get('/sol/:solNum/page/:pageNumber', function (req, res, next) {
>>>>>>> done with UI
  const solNum = req.params.solNum;
  const pageNum = req.params.pageNumber;
  axios({
    baseURL: 'https://api.nasa.gov/',
    method: "get",
    url: "insight_weather/?api_key=" + NASA_KEY + "&feedtype=json&ver=1.0"
  }).then(response => {
    if (!response.data[solNum]) {
      res.status(404).send("Sol is not found, is it one of the last seven?").statusCod
    }
    return response.data[solNum];
  }).then(data => {
    let solData = Object.assign({}, data);
    solData.date = new Date();
    setDateFromString(solData.date, data["First_UTC"])
    return solData;
    // res.render('oneSol', { page: "Sol" + solNum, sol: solNum, data: solData });
  }).then(async data => {
    let totalPages = await getTotalPages(solNum);
    if (totalPages >= pageNum) {
      let response = await axios("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=" + pageNum + "&api_key=" + NASA_KEY);
<<<<<<< HEAD
      await res.render('oneSol', { page: "Sol" + solNum, sol: solNum, data: data, pages: totalPages, images: response.data.photos, current: pageNum });
=======
      await res.render('oneSol', { page: "Sol " + solNum, sol: solNum, data: data, pages: Math.ceil(totalPages / 25), images: response.data.photos, current: pageNum });
>>>>>>> done with UI
    }
  }).catch(err => {
    res.status(500).send(err ? err : "Internal Server Error");
  })
});

module.exports = router;