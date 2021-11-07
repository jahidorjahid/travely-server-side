const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 5000;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3lrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    const database = client.db("travely");
    const roomCollection = database.collection("room");

    app.get("/", (req, res) => {
      console.log("mongodb connected sucess");
      res.send("hello node js");
    });
  } finally {
    // client.close()
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("listening port: ", port);
});
