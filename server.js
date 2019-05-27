const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const user = require('./routes/user-router');
const api = require('./routes/api-router');
const cors = require('cors');
const session = require('express-session');
const exjwt = require('express-jwt');

const app = express();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', () => console.log('connected to mongodb'));
mongoose.connect('mongodb://localhost/newb', { useNewUrlParser: true, useFindAndModify: false });

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    res.setHeader('access-control-allow-headers', 'x-requested-with content-type');
    next();
})

// cookie-parser middleware
app.use(cookieParser());

//  set views directory
app.set('views', __dirname + '/static/views');

// use express.static middleware. enables things like localhost/login.html
app.use(express.static('static/views'));

// bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
app.use('/api', api);

app.listen(5000, () => {
    console.log('Listening on localhost:5000');
});
