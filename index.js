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

  if (received_message.text) {
    // Get the URL of the message attachments
    Question.find()
      .exec()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
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
              buttons: [
                {
                  type: "postback",
                  title: "Walkin!",
                  payload: "A"
                },
                {
                  type: "postback",
                  title: "Reserve table!",
                  payload: "B"
                },
                {
                  type: "postback",
                  title: "Feed back!",
                  payload: "C"
                }
              ]
            }
          ]
        }
      }
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment

    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "What this picture is for?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Review!",
                  payload: "yes"
                },
                {
                  type: "postback",
                  title: "Suggestion!",
                  payload: "yeah"
                }
              ]
            }
          ]
        }
      }
    };
  }
  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  if (payload === "A") {
    // response = { text: "You have opted for Walkins!!" };

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
  } else if (payload === "B") {
    // response = { text: "You have opted for Reservation!." };
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "you have choosen for reservation!",
              subtitle: "please choose these available reservations!",
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
                  title: "7 PM",
                  payload: "d"
                },
                {
                  type: "postback",
                  title: "8 PM",
                  payload: "e"
                },
                {
                  type: "postback",
                  title: "9 PM",
                  payload: "f"
                }
              ]
            }
          ]
        }
      }
    };
  } else if (payload === "C") {
    // response = { text: "You have opted for Feed back!" };
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Thanks for choosing for feed back!",
              subtitle: "Please select below buttons for feed back",
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
                  title: "Best!",
                  payload: "g"
                },
                {
                  type: "postback",
                  title: "Good!",
                  payload: "h"
                },
                {
                  type: "postback",
                  title: "Average!",
                  payload: "i"
                }
              ]
            }
          ]
        }
      }
    };
  } else if (payload === "a") {
    response = { text: "Thanks your walkin is confirmed at 4 PM!" };
  } else if (payload === "b") {
    response = { text: "Thanks your walkin is confirmed at 5 PM!" };
  } else if (payload === "c") {
    response = { text: "Thanks your walkin is confirmed at 6 PM!" };
  } else if (payload === "d") {
    response = { text: "Thanks your table is reserved for 7 PM!" };
  } else if (payload === "e") {
    response = { text: "Thanks your table is reserved for 8 PM!" };
  } else if (payload === "f") {
    response = { text: "Thanks your table is reserved for 9 PM!" };
  } else if (payload === "g") {
    response = { text: "Thanks for your valuable feed back!" };
  } else if (payload === "h") {
    response = { text: "Thanks for your valuable feed back!" };
  } else if (payload === "i") {
    response = { text: "Thanks for your valuable feed back!" };
  } else if (payload === "yes") {
    response = {
      text:
        "Thanks for your response we will review it. Please feel free to chat with us!"
    };
  } else if (payload === "yeah") {
    response = {
      text: "Thanks for your suggestion. Please feel free to chat with us!"
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
// Sets server port and logs message on success
app.listen(port, () => {
  console.log(`webhook is listening on: ${port}`);
});
module.exports = app;
