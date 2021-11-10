const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3lrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travely");
    const roomsCollection = database.collection("rooms");

    // test GET API
    app.get("/", (req, res) => {
      res.send("This is Test API");
    });
    // GET all rooms
    app.get("/rooms", async (req, res) => {
      console.log("mongodb connected sucess");
      const result = await roomsCollection.find({}).toArray();
      res.json(result);
    });

    // GET room by id
    app.get("/rooms/:id", async (req, res) => {
      const roomId = req.params.id;
      const query = { _id: ObjectId(roomId) };
      const room = await roomsCollection.findOne(query);

      if (room._id == roomId) {
        res.send(room);
      }
    });
  } finally {
    // client.close()
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("listening port: ", port);
});
