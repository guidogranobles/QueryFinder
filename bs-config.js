module.exports = {

  "port": 8123,
  "files": ["./**/*.{html,htm,jsp,css,js}"],
  "server": { "baseDir": "./" },
  "browser" : ["Chrome"],
  server: {
 
    middleware: {
      // overrides the second middleware default with new settings
      1: require('connect-history-api-fallback')({index: '/app/index.html', verbose: true})
    }
  }
};