const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.js");

const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require("twilio")(accountSid, authToken);
const corsOptions = {
  origin: ["http://localhost:8080", "https://example.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const eventsRouter = require("./routes/events");
app.use("/events", eventsRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const channelsRouter = require("./routes/channels");
app.use("/channels", channelsRouter);

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");

app.use(express.static(buildPath));

app.get("/", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.get("/stream-events", async (req, res) => {
  const db = await mongoClient.connect();
  const collection = db.db("Calendar").collection("events");

  const changeStream = collection.watch();
  changeStream.on("change", () => {
    // Send the updated data to the client
    res.write("event: update\ndata: updated\n\n");
  });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
});

app.get("/stream-users", async (req, res) => {
  const db = await mongoClient.connect();
  const collection = db.db("Calendar").collection("users");

  const changeStream = collection.watch();
  changeStream.on("change", () => {
    // Send the updated data to the client
    res.write("event: update\ndata: updated\n\n");
  });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
});

app.get("/stream-channels", async (req, res) => {
  const db = await mongoClient.connect();
  const collection = db.db("Calendar").collection("channels");

  const changeStream = collection.watch();
  changeStream.on("change", () => {
    // Send the updated data to the client
    res.write("event: update\ndata: updated\n\n");
  });

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
});

app.post("/", (req, res) => {
  const { message, user: sender, type, members } = req.body;

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClient.messages
            .create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: `+1${user.phoneNumber}`,
            })
            .then(() => console.log("Message sent!"))
            .catch((err) => console.log(err));
        }
      });

    return res.status(200).send("Message sent!");
  }

  return res.status(200).send("Not a new message request");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
