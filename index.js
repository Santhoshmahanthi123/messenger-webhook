"use strict";
require("dotenv").config();
// Imports dependencies and set up http server
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express();
const request = require("request");
const path = require("path");
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const mongoose = require("mongoose");
const DBURL = process.env.DBURL;
const port = process.env.PORT || 3000;
const question_controller = require("./controllers/question");
const option_controller = require("./controllers/options");
const answer_controller = require("./controllers/answers");
const type_controller = require("./controllers/types");
const Question = require("./models/question");
const Option = require("./models/options");
const Type = require("./models/types");
const webhook = require("./controllers/webhook");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(DBURL, {
  useNewUrlParser: true
});

// routes
app.post("/question", question_controller.create_question);
app.get("/question", question_controller.get_questions);
app.delete("/question", question_controller.delete_question);
app.patch("/question", question_controller.update_question);
app.post("/option", option_controller.create_option);
app.get("/option", option_controller.get_options);
app.delete("/option", option_controller.delete_option);
app.patch("/option", option_controller.update_option);
app.post("/answer", answer_controller.post_answer);
app.get("/answer", answer_controller.get_answers);
app.delete("/answer", answer_controller.delete_answer);
app.patch("/answer", answer_controller.update_option);
app.post("/type", type_controller.create_type);
app.get("/type", type_controller.get_types);
app.delete("/type", type_controller.delete_type);
app.patch("/type", type_controller.update_type);
// Creates the endpoint for our webhook
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      // let webhook_event = entry.messaging[0];
      // console.log(webhook_event);

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});
// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "UMRK";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message.text || received_message.attachments) {
    // Get the URL of the message attachments
    Question.find()
      .exec()
      .then(result => {
        console.log(result);
        let options = [];
        result.map(item => {
          options.push({
            type: "postback",
            title: item.question,
            payload: "A:" + item._id
          });
        });
        response = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: "Welcome to Flying Sphaghetti Monster Restaurant!",
                  subtitle: "Choose any of the options below.",
                  image_url:
                    "https://content3.jdmagicbox.com/comp/hyderabad/h5/040pxx40.xx40.140516124003.h3h5/catalogue/flying-spaghetti-monster-restaurant-jubilee-hills-hyderabad-home-delivery-restaurants-p6kmmr.jpg",
                  default_action: {
                    type: "web_url",
                    url:
                      "https://content3.jdmagicbox.com/comp/hyderabad/h5/040pxx40.xx40.140516124003.h3h5/catalogue/flying-spaghetti-monster-restaurant-jubilee-hills-hyderabad-home-delivery-restaurants-p6kmmr.jpg",

                    webview_height_ratio: "tall"
                  },
                  buttons: options
                }
              ]
            }
          }
        };
        callSendAPI(sender_psid, response);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload.split(":");
  let payload_key = payload[0];
  let payload_value = payload[1];
  console.log(payload_key);
  console.log(payload_value);

  if (payload_key === "A") {
    // response = { text: "You have opted for Walkins!!" };
    webhook.create_webhook(payload_value, callback);
    // let options_available = webhook.create_webhook(payload_value);
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "you have choosen for walkin!",
              subtitle: "please choose these available walkins!.",
              image_url:
                "https://content3.jdmagicbox.com/comp/hyderabad/h5/040pxx40.xx40.140516124003.h3h5/catalogue/flying-spaghetti-monster-restaurant-jubilee-hills-hyderabad-home-delivery-restaurants-p6kmmr.jpg",
              default_action: {
                type: "web_url",
                url:
                  "https://content3.jdmagicbox.com/comp/hyderabad/h5/040pxx40.xx40.140516124003.h3h5/catalogue/flying-spaghetti-monster-restaurant-jubilee-hills-hyderabad-home-delivery-restaurants-p6kmmr.jpg",

                webview_height_ratio: "tall"
              },

              buttons: [
                {
                  type: "postback",
                  title: "4 PM",
                  payload: "a"
                },
                {
                  type: "postback",
                  title: "5 PM",
                  payload: "b"
                },
                {
                  type: "postback",
                  title: "6 PM",
                  payload: "c"
                }
              ]
            }
          ]
        }
      }
    };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}
app.post("/test", (req, res) => {
  const input = req.body.select;
  Option.find({ _id: req.body.id })
    .exec()
    .then(result => {
      console.log(result);
      result.map(options => {
        res.json({ options: options.options });
        console.log(options.options);
        options.options.map(check => {
          if (check == input) {
            console.log(check);
            Type.find()
              .exec()
              .then(type => {
                type.map(types => {
                  if (types.option == check) {
                    console.log(types.types[0]);
                  }
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get("/test", (req, res) => {
  var questionId = req.body.questionId;
  var choose = req.body.choose;
  // var type = req.body.type;
  Question.find({ _id: questionId })
    .exec()
    .then(question => {
      console.log("Matched with question Id", question);
      Option.find({ questionId: questionId })
        .exec()
        .then(result => {
          res.json(result[0].options);
          console.log("Choose your option!", result[0].options);
          result[0].options.map(option => {
            if (option == choose) {
              console.log("You have choosen:", option);
              Type.find({ option: option })
                .exec()
                .then(type => {
                  console.log(type[0].types[0]);
                })
                .catch(err => {
                  consolele.log(err);
                });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      consolelog(err);
    });
});
// Sets server port and logs message on success
app.listen(port, () => {
  console.log(`webhook is listening on: ${port}`);
});
module.exports = app;
