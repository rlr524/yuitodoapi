require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const app = express();

mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0-t8nsx.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }
);

const itemSchema = new Schema(
  {
    title: String,
    completed: Boolean,
    deleted: Boolean
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

app.get((req, res) => {
  Item.find({}, (err, foundItems) => {
    if (err) {
      res.send(err);
    } else {
      res.send(foundItems);
    }
  });
});
