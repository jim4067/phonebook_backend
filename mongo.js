const mongoose = require('mongoose');


const password = process.argv[2];
const name_arg = process.argv[3];
const number_arg = process.argv[4];

const url =  `mongodb+srv://fullstack_tutorial:${password}@cluster0-zogjd.mongodb.net/phonebookDB?retryWrites=true&w=majority`;

mongoose.connect(url , {useNewUrlParser: true, useUnifiedTopology:true} );

const PersonSchema = new mongoose.Schema({
    name: String,
    number: Number
});

const Person = mongoose.model('Person' , PersonSchema);

const person = new Person({
    name: name_arg,
    number: number_arg
});

//person.save();
//displaying the no of people in the phonebook
if(process.argv.length < 4 ){
    Person.find({}).then( (result) => {
        result.forEach( person => {
        console.log(person)
        })
        mongoose.connection.close();
    });
} else {
    person.save().then( (result) => {
        console.log("added", name_arg, " ", number_arg," " , "to the phonebook");
        mongoose.connection.close();
    })
}

