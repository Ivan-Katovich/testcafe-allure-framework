const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/reports/allure/allure-report'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/reports/allure/allure-report/index.html');
});

app.listen('1234', function() {
    console.log('Server started: localhost:1234/');
});
