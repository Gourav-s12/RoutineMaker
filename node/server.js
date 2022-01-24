var express = require('express');
var app = express();
var cors = require('cors')

var htdocsRoutes = require('./htdocsRoutes');
var apiRoutes = require('./apiRoutes');
app.use(cors({
  credentials: true,
}));
app.use('', apiRoutes);
app.use('', htdocsRoutes);

var server = app.listen(8086,function(){
    console.log("Example app listening at %s port",server.address().port)
});
