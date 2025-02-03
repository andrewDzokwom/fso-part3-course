import dotenv from 'dotenv'
dotenv.config()
import Note from './models/note.js'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.static('dist'))
app.use(cors())
// to handle incoming objects in JSON

app.use(express.json())

// error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'mal formatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).json({
          error: 'Note not found'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({
        error: 'Invalid id format'
      })
    })
})



// post(adding note) handler
app.post('/api/notes', (req, res, next) => {
  console.log(req.body)
  const body = req.body
  if (!body.content){
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  })

  note.save().then(savedNote => {
    res.json(savedNote)
  })
    .catch(error => next(error))
})

// handle note modification
app.put('/api/notes/:id', (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important
  })

  Note.findByIdAndUpdate(req.params.id, note, { new: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

//delete handling

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json({
        result: 'Message deleted.'
      })
    })
    .catch(error => next(error))
})


// unknown endpoint function
function unknownEndpoint(req, res){
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`)

})
