const express = require('express')
const cors = require('cors')

const Person = require("./mongo");

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.get("/info", (req, res, next) => {
  Person.find({}).then((people) => {
    const count = people.length
    res.send(`This phonebook contains information on ${count} people`)
  }).catch((error => next(error)))

})

app.get("/api/persons", (req, res, next) => {
	Person.find({}).then((people) => {
    res.json(people);
  })
  .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
    .then((person) => {
      if(person){
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then((person) => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error => next(error))
  
})

app.post("/api/persons", (req, res, next) => {

	let person = req.body

  const newPerson = new Person({
    name: person.name,
    number: person.number
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});