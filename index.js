var express = require('express');
var request = require('request');
var xmlparser = require('express-xml-bodyparser');
var app = express();

app.use(xmlparser());

app.use(function(req, res, next) {

    console.log(req.method + ': new request');

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'X-Requested-With');

    if (req.method === 'OPTIONS') {
        console.log('OPTIONS: preflight sent');
        res.send();
    } else if (req.method === "GET") {

        if(req.url == "/AGVyrobceTestuList") {
            return new Promise(resolve => {
                request({ url: "https://covid-19-diagnostics.jrc.ec.europa.eu/devices/export", method: req.method },
                    function (error, response, body) {
                        if (!error) {
                            resolve(body);
                        }
                    }
                );
            }).then(body => {
                console.log('GET: response sent');
                res.send(body);
            });
        }
    } else {
        console.log(req.method + ': is not GET or OPTION request');
        next();
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
