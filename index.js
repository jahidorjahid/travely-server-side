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
    const bookingRoomCollection = database.collection("bookings");

    // test GET API
    app.get("/", (req, res) => {
      // when hit api root url redirect to client side
      res.redirect("https://travely-web.web.app/");
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

    // GET rooms by ids
    app.post("/rooms/ids", async (req, res) => {
      const roomIds = req.body.ids;
      const findIds = roomIds.map((roomId) => ObjectId(roomId));

      const query = {
        _id: {
          $in: findIds,
        },
      };
      const rooms = await roomsCollection
        .find(query)
        .project({ title: 1, price: 1, img1: 1 })
        .toArray();

      if (rooms) {
        res.send(rooms);
      }
    });

    // POST add booking
    app.post("/rooms", async (req, res) => {
      const room = req.body;
      const result = await roomsCollection.insertOne(room);
      if (result.insertedId) {
        res.send(result);
      }
    });

    // POST add booking
    app.post("/bookings/add", async (req, res) => {
      const booking = req.body;
      const result = await bookingRoomCollection.insertOne(booking);
      if (result.insertedId) {
        res.send(result);
      }
    });

    // GET all booking
    app.get("/bookings", async (req, res) => {
      const query = {};
      const result = await bookingRoomCollection.find(query).toArray();
      if (result.length > 0) {
        res.send(result);
      }
    });

    // POST booking info by customerEmail
    app.post("/bookings", async (req, res) => {
      const userEmail = req.body.email;
      const query = { customerEmail: userEmail };
      const result = await bookingRoomCollection.find(query).toArray();

      // print a message if no documents were found
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ error: "No documents found!" });
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
