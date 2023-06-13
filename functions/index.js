/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const bodyParser = require("body-parser");

const credential = require("./key.json");

const handlers = require("./handlers");
const fs = require("fs");

const app = express();

app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
);

app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use(bodyParser.text());

admin.initializeApp({
  credential: admin.credential.cert(credential),
});

// admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

app.get("/create", async (req, res) => {
  try {
    let rand = "";
    let d = 0;
    while (d < 3) {
      rand += Math.floor(Math.random() * 10);
      d++;
    }

    const username = req.query.username;
    const password = req.query.password;

    const userJson = {
      username,
      password,
      id: rand,
    };

    const response = db.collection("users").add(userJson);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.get("/read/all", async (reg, res) => {
  try {
    const usersRef = db.collection("users");
    const response = await usersRef.get();
    const responseArr = [];
    response.forEach((doc) => {
      responseArr.push(doc.data());
    });
    res.send(responseArr);
  } catch (error) {
    res.send(error);
  }
});

app.get("/read/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

app.post("/update", async (req, res) => {
  try {
    const id = req.body.id;
    const newFirstName = "hello world!";
    const userRef = await db.collection("users").doc(id).update({
      firstName: newFirstName,
    });
    res.send(userRef);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const response = await db.collection("users").doc(req.params.id).delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.get("/", (req, res) => {
  res.send("server running success");
});

app.get("/form", handlers.handleGetMethod);
app.get("/users/:username", handlers.handleUser);

app.get("/product/:productId", handlers.handleProduct);

app.get("/products/categories", handlers.handleCategories);

app.get("/updatecolor", handlers.updatecolor);

app.post("/createProduct", handlers.createProduct);

app.get("/getAllProducts", handlers.getAllProducts);

app.get("/getProductById/:pId", handlers.getProductById);

app.get("/download", (req, res) => {
  const file = `${__dirname}/videos/sample.mp4`;
  res.download(file);
  res.statusCode = 200;
  res.end("file download success");
});

app.get("/myfile", (req, res) => {
  fs.readFile(__dirname + "/db/productInfo.json", "utf8", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.post("/signup", (req, res) => {
  let existingUser = [];
  fs.readFile(__dirname + "/db/signup.json", "utf8", (err, data) => {
    if (err) throw err;
    existingUser = [...JSON.parse(data), req.body];
    const writer = fs.createWriteStream("./db/signup.json");
    writer.write(JSON.stringify(existingUser));
    res.send(existingUser);
  });
});

app.get("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  fs.readFile(__dirname + "/db/signup.json", "utf8", (err, data) => {
    if (err) return err;
    const myDB = JSON.parse(data);
    let isValid = false;

    myDB.forEach((element) => {
      if (element.username === username && element.password === password) {
        isValid = true;
        res.send("login success");
        res.end();
      }
    });

    if (!isValid) {
      res.send("login fail");
      res.end();
    }
  });
});

// app.listen(3001, () => {
//   console.log("Server Started Sucess");
// });

exports.app = functions.https.onRequest(app);
