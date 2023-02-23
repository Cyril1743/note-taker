const express = require("express")
const db = require("./db/db.json")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = 3001

app.use(express.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile("./public/index.html")
})
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
}
)
app.get("/api/notes", (req, res) => {
    res.json(db)
})
app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.json(err)
        } else {
            var newNote = req.body
            var savedNote = JSON.parse(data)
            savedNote.push(newNote)
            fs.writeFile("./db/db.json", JSON.stringify(savedNote, null, 4), (err) => {
                err ? res.status(500).json(err) : res.status(200).json("Added new note")
            })
        }
    })
})
app.delete("/api/notes/:id", (req, res) => {
    var noteId = req.params.id
    db.forEach( note => {
        if (note.id == noteId) {
            var index = db.indexOf(note)
            if (index > -1) {
                db.splice(index, 1)
                fs.writeFile("./db/db.json", JSON.stringify(db, null, 4), (err) => err ? res.status(500).json(err) : res.status(200).json("Successfully deleted note"))
            }
        } else {
            res.status(500).json("Failure to delete Note")
        }
    })
})
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})