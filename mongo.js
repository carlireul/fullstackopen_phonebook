const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("missing password");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin-1:${password}@cluster0.3oq8r1k.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4){
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  person.save().then((result) => {
    console.log(`added ${person.name} to phonebook`);
    mongoose.connection.close();
  });
}


