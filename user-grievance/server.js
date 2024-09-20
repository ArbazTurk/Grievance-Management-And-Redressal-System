import express from 'express';
import pkg from 'body-parser';
import cookieParser from 'cookie-parser';
import { realpathSync } from 'fs';
import path from 'path';

import { underscore } from 'consolidate';
import { fileURLToPath } from 'url';
import 'dotenv/config'
const root = realpathSync('.');
const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const { json, urlencoded } = pkg;
//configuring vendor based middlewares
app.use('/', express.static(path.join(__dirname, '/dist/')));
app.use('/src/assets', express.static(__dirname + '/src/assets/'));
// app.use('/static', express.static(__dirname + '/dist/static/'));
app.use('/dist', express.static(__dirname + '/dist/'));

app.use(json());
app.use(cookieParser());
app.use(urlencoded({
    extended: false
}));

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

//rendering engine
app.set('views', './');
app.engine('html', underscore);
app.set('view engine', 'html');

app.get('/*', function (req, res) {
    res.sendFile(path.join(root, 'dist/index.html'));
});

//SERVER LISTENING
var port = process.env.PORT ? process.env.PORT : 4002;
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port; //Route to Frontend to make socket connection
    console.log('Node server running at http://%s:%s. API in use: %s', host, port, app.get('env'));
});