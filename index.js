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

//Your endpoints go here
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
  res.status(404).json({'message': "Tune with id " + req.params.id + "was no found"});

});



app.get('/genres', (req,res) => {
    res.status(200).json(genres)
  }
);

app.post('/genres', (req, res) => {
 // if (req.body === undefined || req.body.genreName === undefined) {
 //   res.status(400).json({"message": "GenreName is required to create a new genre"})
 //   return
  //}
 // else{
    let newGenre = { genreName: req.body.genreName, id: genreid_gen}
    genres.push(newGenre)
    genreid_gen++
    res.status(201).json(newGenre)
  //}
});



app.get('/tunes/:id', (req, res) => {
    for (let i = 0; i < tunes.length; i++) {
        if (tunes[i].id == req.params.id) {
            res.status(200).json(tunes[i])
            return
        }
    }
    res.status(404).json({'message': "Tune with id " + req.params.id + "was no found"});

});

//app.delete('/genre', (req, res) => {
 //   var emptygenre = genre
//} 
//)



//Start the server
app.listen(port, () => {
    console.log('Tune app listening on port + ' + port);
});
