const express = require("express");
const db = require("./db/db.json");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
//Using middleware
app.use(express.json());
app.use(express.static("public"));

//Path for default url
app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
}
)

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).send(data);
        }
    })
})

app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.json(err);
        } else {
            var newNote = req.body;
            newNote.id = Math.floor(Math.random() * 1000);
            var savedNote = JSON.parse(data);
            savedNote.push(newNote);
            fs.writeFile("./db/db.json", JSON.stringify(savedNote, null, 4), (err) => {
                err ? res.status(500).json(err) : res.status(200).json(savedNote);
            })
        }
    })
})

app.delete("/api/notes/:id", (req, res) => {
    var noteId = req.params.id;
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).json("Unable to read file");
        } else {
            var status = "Fail";
            data = JSON.parse(data);
            data.forEach(note => {
                if (note.id == noteId) {
                    var index = data.indexOf(note);
                    if (index > -1) {
                        status = "Success";
                        data.splice(index, 1);
                        fs.writeFile("./db/db.json", JSON.stringify(data, null, 4), (err) => err ? res.status(500).json(err) : res.status(200).json("Successfully deleted note"));
                    }
                }
            })
            if (status === "Fail"){
                res.status(500).json("Failure to add note");
            }
        }
    })
})

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
})