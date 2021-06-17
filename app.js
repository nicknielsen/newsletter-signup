const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/e326e93808";

  const options = {
    method: "POST",
    auth: "nick:9a15807a09affe5d57de2345dca946db-us6"
  }

  const request = https.request(url, options, function(response) {
    console.log(response.statusCode);

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    };

    response.on("data", function(data) {
      const memberData = JSON.parse(data);
      console.log(memberData);
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure.html", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Running at port 3000.")
});


// Mailchimp API Key:
//  9a15807a09affe5d57de2345dca946db-us6

// List ID:
//  e326e93808
