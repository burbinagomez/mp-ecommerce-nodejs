var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
var port = process.env.PORT || 3000
const hostname = process.env.host || "http://localhost:" + port
const bodyParser = require('body-parser');
const api_token = process.env.api_token || 'APP_USR-2572771298846850-120119-a50dbddca35ac9b7e15118d47b111b5a-681067803'
const integrator_id = process.env.integrator_id || 'dev_24c65fb163bf11ea96500242ac130004'
const public_api = process.env.public_api || 'APP_USR-a98b17ae-47a6-4a35-b92d-01919002b97e'


mercadopago.configure({
    access_token: api_token,
    integrator_id: integrator_id,
});

var payer = {
    name: "Lalo",
    surname: "Landa",
    email: "test_user_83958037@testuser.com",
    phone: {
        area_code: "52",
        number: 5549737300
    },
    address: {
        street_name: "Insurgentes Sur",
        street_number: 1602,
        zip_code: "03940"
    }
}

let preference = {
    payer: payer,
    back_urls: {
        success: hostname + "/success",
        failure: hostname + "/fail",
        pending: hostname + "/pending"
    },
    auto_return: "approved",
    payment_methods: {
        excluded_payment_methods: [{
            id: "amex"
        }],
        excluded_payment_types: [{
            id: "atm"
        }],
        installments: 6,
    },
    external_reference: "burbinagomez@gmail.com",
    notification_url: hostname + "/notification",
};



var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/detail', function(req, res) {
    req.query.public_api = public_api
    res.render('detail', req.query);
});

app.get('/pending', function(req, res) {
    res.render('pending');
});
app.get('/success', function(req, res) {
    res.render('success', req.query);
});
app.get('/fail', function(req, res) {
    res.render('fail');
});

app.post('/paid', function(req, res) {
    preference.items = req.body;
    preference.items.forEach(element => {
        element.unit_price = parseFloat(element.unit_price)
        element.quantity = parseInt(element.quantity)
        element.picture_url = hostname + element.picture_url
    });
    // preference.payer.phone.number = parseInt(preference.payer.phone.number)
    // preference.payer.address.street_number = parseInt(preference.payer.address.street_number)
    // preference.payment_methods.installments = parseInt(preference.payment_methods.installments)
    mercadopago.preferences.create(preference)
        .then(function(response) {
            res.json(response.body)
        }).catch(function(error) {
            console.log(error);
            res.json(error)
        });
});

app.post('/notification', async function(req, res) {
    const webhook = req.body;
    console.log(webhook)
    res.status(201)
});


app.listen(port);