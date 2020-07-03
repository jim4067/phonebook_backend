const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log("connecting to mongodb url......", url);
mongoose.connect(url, {useUnifiedTopology:true, useNewUrlParser:true} )
        .then( () => {
            console.log("connected to MONGODB")
        })
        .catch( (err) => {
            console.log("ahh shit.....", err)
        })

const person_schema = new mongoose.Schema( {
    name : String,
    number: Number
} );

person_schema.set( 'toJSON' , {
    transform: (document, returned_object) => {
        returned_object.id = returned_object._id.toString();
        delete returned_object._id;
        delete returned_object.__v;
    }
});

const Person = mongoose.model('Person', person_schema);

module.exports = Person;