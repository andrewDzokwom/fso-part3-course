import dotenv from "dotenv";
dotenv.config();
import Note from './models/note.js'
import express from "express"
import cors from "cors"

const app = express()

app.use(express.static("dist"))
app.use(cors())
// to handle incoming objects in JSON

app.use(express.json())




app.get("/", (req, res)=>{
    console.log(req.url);
    
    res.send(`<h1>This is the homepage</h1>`)
})

app.get("/api/notes", (req, res)=>{
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get("/api/notes/:id", (req, res) => {
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                res.status(404).json({
                    error: "Note not found"
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({
                error: "Invalid id format"
            })
        })
})



//delete handling

app.delete("/api/notes/:id", (req, res, next)=>{
  Note.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(204).json({
      result: "Message deleted."
    })
  })
  .catch(error => next(error))
})


// post(adding note) handler
app.post("/api/notes", (req, res, next)=>{
  console.log(req.body)
  const body = req.body
  if (!body.content){
    return res.status(400).json({
      error: "content missing"
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
  // notes = notes.concat(note)
  // res.json(note)
})

// unknown endpoint function 
function unknownEndpoint(req, res){
  res.status(404).send({
    error: "unknown endpoint"
  })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3003
app.listen(PORT, ()=>{
    console.log(`Server running on address http://localhost:${PORT}`);
    
})
