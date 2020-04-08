const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const fs = require('fs');

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey ="";
const privateVapidKey = "";

webpush.setVapidDetails(
  "mailto:contact@please-open.it",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  const username = req.query.username;

  try {
    if (fs.existsSync("/etc/ssh-notification/" + username + "-subscription.json")) {
      let rawdata = fs.readFileSync("/etc/ssh-notification/" + username + "-subscription.json");
      const oldSubscription = JSON.parse(rawdata);
      let payload = JSON.stringify({ type: "error", title: "This slot is not available, please contact admin." });
      if(JSON.stringify(oldSubscription) === JSON.stringify(subscription) ){
        console.log("already subscribed");
        payload = JSON.stringify({ type: "error", title: "Already subscribed" });
      }
      res.status(201).json({});
      webpush.sendNotification(subscription, payload).catch(err => console.error(err));
    }else {
      fs.writeFile("/etc/ssh-notification/" + username + '-subscription.json', JSON.stringify(subscription), function (err) {
        if (err) return console.log(err);
      });
      res.status(201).json({});
    }
  } catch(err) {
    console.error(err)
  }

});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
