const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const express = require('express');
const app = express();

app.get('/foo', (request, response) => {
    response.send('foo!');
});

exports.appboi = functions.https.onRequest(app);
