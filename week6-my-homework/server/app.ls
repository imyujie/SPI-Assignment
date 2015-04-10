require! {express, path, 'cookie-parser', 'body-parser', 'express-session', passport, morgan: logger, mongoose, 'connect-flash': flash, 'multer': mult}

app = express!

app.set 'views', path.join __dirname, 'views'
app.set 'view engine', 'jade'

app.use bodyParser.json!
app.use bodyParser.urlencoded!
app.use mult {dest: './dist/public/uploads/'}
app.use cookieParser!

app.use expressSession secret: 'mySecretKey'

app.use <| express.static path.join __dirname, 'public'

app.use passport.initialize!
app.use passport.session!
app.use flash!


app.use logger 'dev'

initPassport = require './passport/init'
initPassport passport
routes = (require './routes/index') passport
app.use '/', routes

module.exports = app
