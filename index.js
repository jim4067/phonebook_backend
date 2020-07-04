const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();
app.use(express.json());
app.use(express.static('build'));

//using morgan to log to the console
morgan.token('body', function (req) {
    return [JSON.stringify({ "name": req.body.name }), JSON.stringify({ "number": req.body.number })]
});

app.use(morgan(`:method :url :status :response-time ms :body`));

app.use(cors());

/*
app.get('/', (req, res) => {
    res.send("<h1>persons</h1>")
});
*/

app.get('/api/persons', (req, res) => {
    Person.find()
        .then((persons) => {
            res.json(persons);
            console.log("hopefully fetched ....", persons);
        })
});

//getting a single resource
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    Person.findById(id)
        .then((person) => {
            res.json(person);
        })
});



//making a POST request
app.post('/api/persons', (req, res) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then((saved_person) => {
            res.json(saved_person);
        })
});

//deleting a single resource
app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findByIdAndDelete(id)
          .then ( () => {
              res.status(404).end();
          })  
          .catch( (err) => {
              next(err)
          })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`running server on port ${PORT}`);
})