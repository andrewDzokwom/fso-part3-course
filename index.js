import dotenv from "dotenv"
dotenv.config()
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

app.get("/api/notes/:id", (req, res)=>{
    const id = req.params.id
    const note = notes.find(note=> note.id === id)
    if (note){
        res.json(note)
        return
    }
    res.status(400).end(JSON.stringify({
        error: "Note not found"
    }))
    
})

app.get("/api/notes", (req, res)=>{
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

//delete handling

app.delete("/api/notes/:id", (req, res)=>{
  const UserId = req.params.id;
  notes = notes.filter(note => note.id !== UserId);
  res.status(204).end()
})

// id generation
const getId = ()=>{
  const maxId = notes.length > 0? Math.max(...notes.map(note => Number(note.id))): 0;
  return maxId + 1
}
// post handlind 
app.post("/api/notes", (req, res)=>{
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
  
  
  // {
  //   content: body.content,
  //   important: Boolean(body.important) || false,
  //   id: getId()
  // }

  notes = notes.concat(note)
  res.json(note)
})
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Seerver running on address http://localhost:${PORT}`);
    
})
