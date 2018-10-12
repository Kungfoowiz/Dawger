var firebase = require('firebase');

const express = require('express');
const cors = require('cors');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
  projectId: ""
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

const filter = new Filter();

app.enable("trust proxy");
app.use(cors());
app.use(express.json());




app.get('/', (request, response) => {
  response.json({
    message: "Woof woof! 🐶 🐕"
  });
});




app.get('/woofs', (request, response, next) => {

  firestore.collection("woofs").get()
    .then(function (snapshot) {
      var result = snapshot.docs.map(doc => { 
        
        var docResult = doc.data();
        docResult.id = doc.id;

        return docResult;
      });

      response.json(result);
    })
    .catch(next);

});





function isValidWoof(woof) {
  return woof.name && woof.name.toString().trim() !== '' && woof.name.toString().trim().length <= 50 &&
  woof.content && woof.content.toString().trim() !== '' && woof.content.toString().trim().length <= 140;
}





app.use(rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1
}));





app.post('/woofs', (request, response, next) => {
  
  if (isValidWoof(request.body)) {

    const woof = {
      name: filter.clean(request.body.name.toString().trim()),
      content: filter.clean(request.body.content.toString().trim()),
      created: new Date()
    };

    firestore.collection("woofs").add(woof)
      .then(function (createdWoof) {
        console.log("Document written with ID: ", createdWoof.id);
        response.json(createdWoof.id);
      })
      .catch(next);


  }
  else {
    response.status(422);
    
    response.json({
      message: 'Hey! Name and Content are required! Name cannot be longer than 50 characters. Content cannot be longer than 140 characters.'
    });
  }

});





app.use((error, request, response, next) => {
  response.status(500);
  response.json({
    message: error.message
  });
});





app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
});





