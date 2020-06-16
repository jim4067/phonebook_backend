const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json() );
app.use(express.static('build') );

//using morgan to log to the console
morgan.token('body' , function (req) {
    return [JSON.stringify({"name" : req.body.name}), JSON.stringify({"number" : req.body.number})]
} );

app.use(morgan( `:method :url :status :response-time ms :body` ));

app.use(cors() );

let persons = [
    {
        "name": "Arto Hellas",
        "number": "",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }  
]

app.get( '/' , (req, res) => {
    res.send("<h1>persons</h1>")
} );

app.get('/api/persons' , (req , res) => {
    res.json(persons);
} );

app.get('/info', (req, res) => {
    const persons_length = persons.length;
    const date = new Date();

    res.send(`<p>Phonebook has info for ${persons_length} people</p><p>${date}<p>`)
} );

//getting a single resource
app.get('/api/persons/:id' , (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find( p => p.id === id);
    
    if(person){
        return res.json(person);
    } else {
        return res.status(404).end();
    }
} );

function generateID () {
    const maxID = persons.length > 0 ? Math.max(...persons.map( p => p.id) ) : 0;
    return maxID + 1;
}
//making a POST request
app.post('/api/persons' , (req, res) => {
    const body = req.body;

    const repeated = persons.find( p => p.name === body.name);
    if( !body.name || !body.number ){
        return res.status(404).json({
            error: "both name and number must contain a value"
        } );
    }
  if(repeated){
        return res.status(404).json({
            error: "names must be unique"
        });
    }

    const person = {
        name : body.name,
        number : body.number,
        id : generateID()
    }

    persons = persons.concat(person);
    res.json(persons);
} );

//deleting a single resource
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter( p => p.id !== id)

    res.status(404).end(); 
} );
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`running server on port ${PORT}`);
})