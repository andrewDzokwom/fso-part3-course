import express from "express"

const app = express()

// to handle incoming objects in JSON

app.use(express.json())


let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]


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
    res.json(notes)
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

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: getId()
  }

  notes = notes.concat(note)
  res.json(note)
})

app.listen(3001, ()=>{
    console.log(`Seerver running on address http://localhost:3001`);
    
})
