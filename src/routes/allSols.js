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

//helps calculate the total number of entries
async function getTotalEntries(solNum) {
  let response = await axios("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=" + solNum + "&api_key=" + NASA_KEY);
  return await response.data.photos.length;
}

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

//gets the page for displaying the data of a particular 
router.get('/sol/:solNum/page/:pageNumber', function (req, res, next) {
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
    let totalPages = Math.ceil((await getTotalEntries(solNum)) / 25);
    if (totalPages >= pageNum) {
      let response = await axios("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=" + pageNum + "&api_key=" + NASA_KEY);
      await res.render('oneSol', { page: "Sol " + solNum, sol: solNum, data: data, pages: totalPages, images: response.data.photos, current: pageNum });
    }
    else {
      res.status(404).send("Page out of bounds.")
    }
  }).catch(err => {
    res.status(500).send(err ? err : "Internal Server Error");
  })
});


//Made to decrease load times, it avoids waiting for one async call
router.get('/sol/:solNum/page/:pageNumber/total/:totalPages', function (req, res, next) {
  const solNum = parseInt(req.params.solNum);
  const pageNum = parseInt(req.params.pageNumber);
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
  }).then(async data => {
    let totalPages = parseInt(req.params.totalPages);
    if (totalPages >= pageNum) {
      let response = await axios("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=" + pageNum + "&api_key=" + NASA_KEY);
      await res.render('oneSol', { page: "Sol " + solNum, sol: solNum, data: data, pages: totalPages, images: response.data.photos, current: pageNum });
    }
    else {
      res.status(404).send("Page out of bounds.")
    }
  }).catch(err => {
    console.log(err);
    res.status(500).send(err ? err : "Internal Server Error");
  })
});

module.exports = router;