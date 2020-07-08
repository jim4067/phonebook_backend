const mongoose = require('mongoose');
const unique_validator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

console.log("connecting to mongodb url......", url);
mongoose.connect(url, {useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex: true} )
        .then( () => {
            console.log("connected to MONGODB")
        })
        .catch( (err) => {
            console.log("ahh shit.....", err)
        })

const person_schema = new mongoose.Schema( {
    name :{
        type: String,
        minlength: 3,
        required: true,
        unique: true
    } ,
    number: {
        type: Number,
        minlength:  3,
        required: true,
        unique: true
    }
} );
person_schema.plugin(unique_validator);

person_schema.set( 'toJSON' , {
    transform: (document, returned_object) => {
        returned_object.id = returned_object._id.toString();
        delete returned_object._id;
        delete returned_object.__v;
    }
});

const Person = mongoose.model('Person', person_schema);

module.exports = Person;