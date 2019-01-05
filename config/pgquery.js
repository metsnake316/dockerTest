var pg = require("pg");

module.exports = {
   query: function(text, values, cb) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });
   }
}