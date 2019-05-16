const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const user = require('./routes/user-router');
const cors = require('cors');
const exjwt = require('express-jwt');

const app = express();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', () => console.log('connected to mongodb'));
mongoose.connect('mongodb://localhost/newb', { useNewUrlParser: true });

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

// const jwt_middleware = exjwt({
//     secret: 'keyboard cat'
// })

// routing
app.use('/user', user);

// app.get('/', sessionChecker, (req, res) => {
//     res.redirect('/login');
// });
app.get('/', (req, res) => {
    res.send(JSON.stringify({matches: false}));
});

app.post('/', (req, res) => {
    res.send(JSON.stringify({ matches: true }));
})


app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/views/register.html');
});

app.get('/login', (req, res) => {
});

app.get('/dashboard', (req, res) => {
});

app.listen(5000, () => {
    console.log('Listening on localhost:5000');
});