const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const alert = require("alert-node");
exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email }, { mobile: req.body.mobile }).then(
    user => {
      //user shouldn't be an empty array
      if (user.length >= 1) {
        //409 is a conflict
        return res.status(409).json({
          message:
            "E-mail or mobile number is already exists, please try with different email and phone!"
        });
      } else {
        //the number 10 here is to perform hashing 10 times to
        //avoid our password to googling in dictionary tables
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
              mobile: req.body.mobile
            });
            user
              .save()
              .then(result => {
                console.log(result);
                alert("signup completed!");
                res.render("home");
              })
              .catch(err => {
                console.log(err);
                alert(
                  "please enter missing fields or check name and email again!"
                );
              });
          }
        });
      }
    }
  );
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return alert("Please enter correct user name and password!");
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return alert("Please enter correct user name and password!");
        }
        if (result) {
          exports.token = token = jwt.sign(
            {
              name: user[0].name,
              userId: user[0]._id
            },
            process.env.JWTKEY,
            {
              expiresIn: "1h"
            }
          );
          res.render("home");
          console.log("Authentication successful: token: ", token);
          return alert("loggedin successfully!");
        }

        alert("Please enter correct user name and password!")

      });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.body.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted!   "
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.users_get = (req, res, next) => {
  User.findById(req.params.userId)
    .select("email name mobile")
    .exec()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.users_get_all = (req, res, next) => {
  User.find()
    .select("email name address mobile pincode")
    .exec()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.update_user = (req, res) => {
  const id = req.body.userId;
  User.updateMany(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      alert("user updated successfully!");
      res.render("home");
      console.log(result);
    })
    .catch(err => {
      console.log(err);
      alert("please enter missing fields or correct details!")
    });

};
