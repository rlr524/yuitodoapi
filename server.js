require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-t8nsx.mongodb.net/yuitodoDB?retryWrites=true&w=majority`,
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

app
  .route("/todoitems")

  .get((req, res) => {
    Item.find({}, (err, foundItems) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundItems);
      }
    });
  })

  .post((req, res) => {
    const newItem = new Item({
      title: req.body.title,
      completed: false,
      deleted: false
    });
    newItem.save(err => {
      if (err) {
        res.send.err;
      } else {
        res.send(
          "Successfully added a new todo item with the title " +
            "'" +
            newItem.title +
            "'"
        );
      }
    });
  });

app
  .route("/todoitems/:itemId")

  .get((req, res) => {
    Item.findOne({ _id: req.params.itemId }, (err, foundItem) => {
      if (err) {
        res.send(err);
      } else if (foundItem) {
        res.send(foundItem);
      } else {
        res.send("No item with that id was found");
      }
    });
  })

  .delete((req, res) => {
    Item.updateOne(
      { _id: req.params.itemId },
      { $set: { deleted: true } },
      err => {
        if (!err) {
          res.send("Successfully flagged the item as deleted");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Item.updateOne(
      { _id: req.params.itemId },
      { $set: { completed: true } },
      err => {
        if (!err) {
          res.send("Successfully flagged the item as completed");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(process.env.PORT || 3000, () => {
  let port = process.env.PORT || 3000;
  console.log("Server started on port " + port);
});
