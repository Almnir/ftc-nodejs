exports.index = function(req, res) {
    db.all('SELECT * FROM posts ORDER BY title', function(err, row) {
        if (err !== null) {
            res.send(500, "An error has occurred -- " + err);
        } else {
            console.log(row);
            res.render('index.jade', {
                posts: row
            }, function(err, html) {
                res.send(200, html);
            });
        }
    });
};