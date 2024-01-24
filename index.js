const express = require('express')
const cors = require('cors')

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

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {

	const time = new Date()

	res.send(`<p>Phonebook has info for ${data.length} people </p><p>${time}</p>`)
})

app.get("/api/persons", (req, res) => {
	res.json(data)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = data.find(person => person.id === id)

	if(!person){
		res.status(404).end()
	} else {
		res.json(person)

	}

})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (req, res) => {

	let person = req.body

	if (Object.keys(person).length !== 2) {
    return res.status(400).json({
      error: "content missing",
    });
  } // validate that it's actually a name and number

  	if(data.find(p => p.name === person.name)){
		return res.status(400).json({
			error: "name already exists"
		})
	}


	const id = Math.floor(Math.random() * 1000)

	person = {...person, "id": id}

	data = data.concat(person)

	res.json(person)
	

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});