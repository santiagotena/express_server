const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let persons = [
	{ 
		"id": "1",
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": "2",
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": "3",
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{ 
		"id": "4",
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
]

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
	if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

const generateId = () => {
  const max = 1000000
	const randomInt = Math.floor(Math.random() * max)
	return randomInt.toString()
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
	if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
	if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)
	response.json(person)
})

app.get('/info', (request, response) => {
	const peopleNumber = persons.length
	const now = new Date().toString()
	
	infoMessage = `<p>Phonebook has info for ${peopleNumber} people</p> 
								<p>${now}</p>`
	response.send(infoMessage)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})