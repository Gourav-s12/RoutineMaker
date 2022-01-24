/**
 * This script handles routers for html doucuments and images for the site.
 */
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var path = require('path');
router.route('/:pg.:ex').all(function (req, res) {  
    res.sendFile(path.resolve(__dirname + "/../htdocs/" + req.params.pg+"."+req.params.ex)); 
});
router.route('/').all(function (req, res) {  
    res.sendFile(path.resolve(__dirname + "/../htdocs/" + "index.html")); 
});
 module.exports = router;
