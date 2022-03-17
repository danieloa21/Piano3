//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');


const app = express();

//Port environment variable already set up to run on Heroku
let port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

//Set Cors-related headers to prevent blocking of local requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//The following is an example of an array of two tunes.  Compared to assignment 2, I have shortened the content to make it readable
var tunes = [
    { id: '0', name: "Für Elise", genreId: '1', content: [{note: "E5", duration: "8n", timing: 0},{ note: "D#5", duration: "8n", timing: 0.25},{ note: "E5", duration: "8n", timing: 0.5},{ note: "D#5", duration: "8n", timing: 0.75},
    { note: "E5", duration: "8n", timing: 1}, { note: "B4", duration: "8n", timing: 1.25}, { note: "D5", duration: "8n", timing: 1.5}, { note: "C5", duration: "8n", timing: 1.75},
    { note: "A4", duration: "4n", timing: 2}] },

    { id: '3', name: "Seven Nation Army", genreId: '0', 
    content: [{note: "E5", duration: "4n", timing: 0}, {note: "E5", duration: "8n", timing: 0.5}, {note: "G5", duration: "4n", timing: 0.75}, {note: "E5", duration: "8n", timing: 1.25}, {note: "E5", duration: "8n", timing: 1.75}, {note: "G5", duration: "4n", timing: 1.75}, {note: "F#5", duration: "4n", timing: 2.25}] }
];

let genres = [
    { id: '0', genreName: "Rock"},
    { id: '1', genreName: "Classic"}
];

let genreid_gen = 2;
let tuneid_gen = 4;

//Your endpoints go here

//endpoint

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send('Backend for piano');
});


app.get('/tunes', (req, res) => {
  let noContents = tunes.map((tune) => {
      let newObj = {
          id: tune.id,
          name: tune.name,
          genre: tune.genreId
      }
      return newObj;
  });

  res.status(200).send(noContents); 
});

app.get('/tunes/:id', (req, res) => {
  for (let i = 0; i < tunes.length; i++) {
      if (tunes[i].id == req.params.id) {
          res.status(200).json(tunes[i])
          return
      }
  }
  res.status(404).json({'message': "Tune with id " + req.params.id + " was not found"});

});

app.post('/genres/:id/tunes', (req, res) => {
    if (req.body === undefined || req.body.name === undefined || req.body.content === undefined){
        res.status(400).json({"message": "the tune name and contents are required to create a new tune"});
        return;
    }
    else {
        for (let i=0; i < req.body.content.length; i++) {
            if (req.body.content[i].note === undefined || req.body.content[i].duration === undefined || req.body.content[i].timing === undefined){
                res.status(400).json({"message": "The attributes of contents are required to create a new tune"});
                return;    
            }
        }
        let newTune = { id: tuneid_gen, name: req.body.name, genreId: req.params.id, content: req.body.content}
        
        for (let i=0; i < genres.length; i++) {
            if (req.params.id === genres[i].id) {
                tunes.push(newTune)
                tuneid_gen++
                res.status(201).json(newTune)
                return;
            }
        }
        
        res.status(404).json({"message": "The genre id " + req.params.id + " does not exist"});
    }
});

app.patch('/genres/:id/tunes/:id', (req, res) => {
    if (req.body === undefined || req.body.name === undefined || req.body.content === undefined){
        res.status(400).json({"message": "Either name or content is requried in order to patch"});
        return;
    }
    else {
        for (let i=0; i < tunes.length; i++) {
            if (tunes[i].id == req.params.id) {
                if (req.body.name !== undefined) {
                    tunes[i].name = req.body.name;
                }
                if (req.body.genreId !== undefined) {
                    tunes[i].genreId = req.body.genreId;
                }
                if (req.body.content !== undefined) {
                    tunes[i].content = req.body.content;
                }
                res.status(200).json(tunes[i]);
                return;
            }
        }
        res.status(404).json({'message': "Tune with id " + req.params.id + " does not exist"})
    }   
});


app.get('/genres', (req, res) => {
    res.status(200).json(genres)
  }
);

app.get('/genres/:id', (req, res) => {
    for (let i = 0; i < genres.length; i++) {
        if (genres[i].id == req.params.id) {
            res.status(200).json(genres[i])
            return;
        }
    }
    res.status(404).json({'message': "Genre with id " + req.params.id + " was not found"});
  
  });
  


app.post('/genres', (req, res) => {
    for (let i = 0; i < genres.length; i++) {
      if (genres[i].genreName === req.body.genreName){
        res.status(303).json({"message": "genreName already exists"})
        return;
      }
    }
    if (req.body === undefined || req.body.genreName === undefined) {
      res.status(400).json({"message": "genreName is required to create a new genre"})
      return;
    }
    else{
      let newGenre = { genreName: req.body.genreName, id: genreid_gen}
      genres.push(newGenre)
      genreid_gen++
      res.status(201).json(newGenre)
    }
  });

  app.delete('/genres/:id', (req, res) => {
    
    for (let i = 0; i < tunes.length; i++) {
        if (tunes[i].genreId == req.params.id) {
            res.status(200).json({"message": "Genre with id " + req.params.id + " has tunes in it. The genre must be empty to delete"});
            return;
        }
    }

    for (let i = 0; i < genres.length; i++) {
        if (genres[i].id == req.params.id) {
            res.status(200).json(genres.splice(i, 1));
            return;
        }
    }

    res.status(404).json({'message': "Genre with id " + req.params.id + " was not found"});
  });

//Start the server
app.listen(port, () => {
    console.log('Tune app listening on port + ' + port);
});
