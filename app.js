/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('ftc.db');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/ftc_logo_fav.png'));
app.use(logger('dev'));
app.use(express.bodyParser());
// app.use(multer()); // for parsing multipart/form-data
app.use(methodOverride('_method'));
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') == 'development') {
    app.locals.pretty = true;
}

// -----------------------DB initialization---------------------------

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='posts'",
    function(err, rows) {
        if (err !== null) {
            console.log(err);
        } else if (rows === undefined) {
            db.run('CREATE TABLE "posts" ' +
                '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                '"title" VARCHAR(255), ' +
                '"post" VARCHAR(255), ' +
                'url VARCHAR(255))', function(err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'posts' initialized.");
                    }
                });
        } else {
            console.log("SQL Table 'posts' already initialized.");
        }
    });

// === routing ===
app.get('/', function(req, res) {
    db.all('SELECT * FROM posts ORDER BY title', function(err, row) {
        if (err !== null) {

            res.send(500, "An error has occurred -- " + err);
        } else {
            console.log(row);
            res.render('index.jade', {
                posts: row
            }, function(err, html) {
                res.status(200).send(html);
                // res.send(200, html);
            });
        }
    });
});

app.post('/add', function(req, res) {
    title = req.body.title;
    post = req.body.post;
    url = req.body.url;
    sqlRequest = "INSERT INTO 'posts' (title, post, url) VALUES('" + title + "', '" + post + "', '" + url + "')"
    db.run(sqlRequest, function(err) {
        if (err !== null) {
            res.send(500, "An error has occurred -- " + err);
        } else {
            res.redirect('back');
        }
    });
});

app.get('/about', function(req, res) {
    res.send('Hello World!');
});

app.get('/', routes.index);

// **************server start****************
http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});