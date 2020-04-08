#!/usr/bin/node

const { v4: uuidv4 } = require('uuid');

const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const fs = require('fs');

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const publicVapidKey = "";
const privateVapidKey = "";

webpush.setVapidDetails(
  "mailto:contact@please-open.it",
  publicVapidKey,
  privateVapidKey
);


// Get pushSubscription object
const username = process.env.PAM_USER;
let rawdata = fs.readFileSync("/etc/ssh-notification/" + username + "-subscription.json");
const subscription = JSON.parse(rawdata);
const sessionId = uuidv4();
console.log(sessionId);
// Create payload
const payload = JSON.stringify({ title: "New connection request", id: sessionId });

// Pass object into sendNotification
webpush
  .sendNotification(subscription, payload)
  .catch(err => console.error(err));

setTimeout((function() {
    return process.exit(1);
}), 4000);

app.post("/send", (req, res) => {
    if(req.body.id === sessionId){
        console.log("code ok");
        return process.exit(0);
    } else {
        console.log("incorrect code");
        return process.exit(1);
    }
});

const port = 5001;

app.listen(port, () => console.log(`Server started on port ${port}`));
