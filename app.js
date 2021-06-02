var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
var port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const api_token = process.env.api_token
const integrator_id = process.env.integrator_id
mercadopago.configure({
    access_token: api_token,
    integrator_id: integrator_id,
});
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
    res.render('detail', req.query);
});

app.get('/pending', function(req, res) {
    res.render('pending', req.query);
});
app.get('/success', function(req, res) {
    res.render('success', req.query);
});
app.get('/fail', function(req, res) {
    res.render('fail', req.query);
});

app.post('/paid', function(req, res) {
    let preference = req.body;
    preference.items.forEach(element => {
        element.unit_price = parseFloat(element.unit_price)
        element.quantity = parseInt(element.quantity)
    });
    preference.payer.phone.number = parseInt(preference.payer.phone.number)
    preference.payer.address.street_number = parseInt(preference.payer.address.street_number)
    preference.payment_methods.installments = parseInt(preference.payment_methods.installments)
    mercadopago.preferences.create(req.body)
        .then(function(response) {
            // Este valor reemplazará el string "<%= global.id %>"
            // en tu HTML
            global.id = response.body.id;
            res.json(response.body)
        }).catch(function(error) {
            console.log(error);
            res.json(error)
        });
});

app.post('/notification', async function(req, res) {
    const webhook = req.body;
    switch (webhook.type) {
        case "payment":
            console.log(webhook)
            mercadopago.payment.findById(webhook.id)
            res.status(201)
            break;
        case "plan":
            mercadopago.plan.findById(webhook.id)
            break;
        case "subscription":
            mercadopago.subscription.findById(webhook.id)
            break;
        case "invoice":
            mercadopago.invoice.findById(webhook.id)
            break;

        default:
            break;
    }
});


app.listen(port);