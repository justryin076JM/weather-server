const express = require('express');
const path = require('path');
const hbs = require('hbs');
const utils = require('./utils');

const app = express();
const port = process.env.PORT||3000;

//defining paths to express config
const publicDir = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

//setting up handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

//setting up static directory to serve
app.use(express.static(publicDir));

app.use('/help',express.static(publicDir));
app.use('/about', express.static(publicDir));

app.get('',(req,res) => {
    res.render('index',{
        title:'Weather App',
        name: 'Srikar Godisela',
        pageName: 'Home'
    });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title:'Weather App',
        name: 'Srikar Godisela',
        pageName: 'About'
    });
});

app.get('/help',(req,res) => {
    res.render('help',{
        title:'Weather App',
        name: 'Srikar Godisela',
        pageName : 'Help'
    });
});

/*
app.get('',(req, res) => {
    res.send('Hello Express');
});

app.get('/help', (req, res) => {
    res.send('<h2>Help Under Construction</h2>');
});

app.get('/about', (req, res) => {
    res.send('<h2>About Under Construction</h2>');
});
*/
app.get('/weather', (req, res) => {
    if (!req.query.address)
        return res.send(
            {
                error: 'Please provide an address to retrieve weather details'
            }
        );
    utils.getLongLatFromMapBox(req.query.address, (err, res0) => {
        if (err)
            return res.send(err);
        if (res0) {
            utils.myRequestWithJSONResponse(res0, (err1, res1) => {
                if (err1)
                    return res.send(err1);
                if (res1)
                    return res.send(res1);
            })
        }
    })

    /*
    res.send({
        address: req.query.address
    });
    res.send('<h2>Weather Under Construction</h2>');
    */
});

app.get('/*',(req,res) => {
    res.render('help',{
        title:'Weather App',
        name: 'Srikar Godisela',
        pageName: 'Help'
    });
});

app.listen(port, () => {
    console.log('Server is up on '+port);
});