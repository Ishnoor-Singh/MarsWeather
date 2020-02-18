var express = require('express');
var router = express.Router();
const axios = require("axios");
const NASA_KEY = "zXNaKE8fo0wNYalgcqNt0yOWG9rdk5vuNLH4H7gd";

/* GET home page. */
router.get('/', function (req, res, next) {
  axios({
    baseURL: 'https://api.nasa.gov/',
    method: "get",
    url: "insight_weather/?api_key=" + NASA_KEY + "&feedtype=json&ver=1.0"
  })
  .then(response => {
    let solList = response.data.sol_keys;
    
    res.render('allSols', {page: "Last Seven Sols", sols: solList }
    )})
  // res.render('allSols', { title: 'Express' });
});
  
module.exports = router;
