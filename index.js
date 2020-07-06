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
          .then( person => {
              if(person === null || undefined ){
                  res.status(404).end();
              } else {
                  res.json(person)
              }
          }) 
          .catch( (err) => {
              next(err)
          })
});


//making a POST request
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(body.content === undefined || null ){
        res.status(404).send({ erro: "body undefined or null "});
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then((saved_person) => {
            res.json(saved_person);
        })
});

//updating a resource
//when you get the names in a dn array then comapre it with the nam in  the body of the request

app.put( '/api/persons',(req, res, next) => {
    const body = req.body;

    const person = {
        name : body.name,
        number: body.number
    }

    Person.findOneAndUpdate( {name : body.name}, {number: body.number}, { new: true }, (err, result) => {
        if(err){
            res.json({"there was an error in your request" : err});
        } else (
            res.json(result)
        )
    }); 

})

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

//unknown endpoint
const unknown_endpoint = (req, res) => {
    res.status(404).send({error: "unknown endpoint"})
}
app.use(unknown_endpoint);

//error middleware. 
const error_handler = (err , req, res, next) => {
    console.error(err);

    if (err.name === 'CastError' && err.kind === 'objectId'){
        return res.status(404).send({error : "malforamtted id"});
    }
    next(err)
}
app.use(error_handler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`running server on port ${PORT}`);
})