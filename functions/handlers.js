const myfile = require("./db/productInfo.json");
const fs = require("fs");

const handleGetMethod = (req, res) => {
  res.send(`
      <html>
      <head>
  <style>
      .dspform
      {
          width: 500px;
          height: 500px;
          background-color: aqua;
          margin: 0 auto;
      }
      .dspform input
      {
          margin: 20px;
          position: relative;
          left: 100px;
          width: 200px;
          height: 30px;
      }
  </style>
  <script>
      function display()
      {
  
  document.getElementById("fname").innerHTML="ksfjfsd"
      }
  </script>
      </head>
      <body>
          <form>
              <div class="dspform">
              <input type="text" placeholder="enter firstname here" id="fname">
              <br>
              <input type="text" placeholder="enter lastnae here" id="lname">
              <br>
              <input type="text" placeholder="Full Name" id="dspvalue">
              <br>
              <input type="submit" value="display" onclick="display()">
         
          </div>
          </form>
      </body>
  </html>
      `);
};

const handleUser = (req, res) => {
  console.log(req.params);
  res.send([
    {
      id: 20,
      email: "...",
      username: "...",
      password: "...",
      name: {
        firstname: "...",
        lastname: "...",
      },
      address: {
        city: "...",
        street: "...",
        number: "...",
        zipcode: "...",
        geolocation: {
          lat: "...",
          long: "...",
        },
      },
      phone: "...",
    },
    {
      id: 1,
      email: "...",
      username: "...",
      password: "...",
      name: {
        firstname: "...",
        lastname: "...",
      },
      address: {
        city: "...",
        street: "...",
        number: "...",
        zipcode: "...",
        geolocation: {
          lat: "...",
          long: "...",
        },
      },
      phone: "...",
    },
  ]);
};

const handleCategories = (req, res) => {
  res.send(["electronics", "jewelery", "men's clothing", "women's clothing"]);
};

const handleProduct = (req, res) => {
  const productId = req.params.productId;
  if (productId > 4) res.end("cant find");
  res.send(myfile[productId]);
};
const updatecolor = (req, res) => {
  res.end(`<html>
    <head style="background-color: ${req.query.color}"> </head>
    <body style="background-color: ${req.query.color}"></body>
  </html>
  `);

  //   if (req.query.color === "brown") {
  //     res.end(`<html>
  //         <head style="background-color: brown"> </head>
  //         <body style="background-color: brown"></body>
  //       </html>
  //       `);
  //     return;
  //   }
  //   if (req.query.color === "red") {
  //     res.end(`<html>
  //         <head style="background-color: red"> </head>
  //         <body style="background-color: red"></body>
  //       </html>
  //       `);
  //     return;
  //   }
  //   res.end("not found");
};

const createProduct = (req, res) => {
  // const { id, price, title, category, description, image } = req.body;

  // console.log(id, price, title, category, description, image);

  fs.readFile(__dirname + "/db/productInfo.json", "utf8", (err, data) => {
    if (err) throw err;

    console.log(data, "data data", req.body);
    const newProdcuts = [...JSON.parse(data), req.body];

    const writer = fs.createWriteStream("productInfo.json");
    writer.write(JSON.stringify(newProdcuts));
    res.send(newProdcuts);
  });

  // res.end("data added successfully");
};

const getAllProducts = (req, res) => {
  fs.readFile(__dirname + "/db/productInfo.json", "utf8", (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
};

const getProductById = (req, res) => {
  const pId = req.params.pId;

  fs.readFile(__dirname + "/db/productInfo.json", "utf8", (err, data) => {
    if (err) throw err;

    const productsData = JSON.parse(data);
    const result = productsData.filter((prod) => prod.id === pId);
    res.send(result);
  });
};

module.exports = {
  handleGetMethod,
  handleUser,
  handleCategories,
  handleProduct,
  updatecolor,
  createProduct,
  getAllProducts,
  getProductById,
};
