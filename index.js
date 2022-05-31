const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
// enable cors
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json());

// ---------------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtctp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// ---------------------------------------------------------------------------
async function run() {
  try {
    await client.connect();
    const collection = client
      .db("healthy-health-warehouse")
      .collection("products");
    // get api *https://healthy-health-warehouse.herokuapp.com/products*---------------------------------------------------------------------------
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = collection.find(query);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });
    // get one api *https://healthy-health-warehouse.herokuapp.com/products/:id*---------------------------------------------------------------------------
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await collection.findOne(query);
      res.send(product);
    });
    // create api *https://healthy-health-warehouse.herokuapp.com/products*---------------------------------------------------------------------------
    app.post("/products", async (req, res) => {
      const newproducts = req.body;
      const products = await collection.insertOne(newproducts);
      res.send(products);
    });
    // update products *https://healthy-health-warehouse.herokuapp.com/products/:id*---------------------------------------------------------------------------
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateproducts = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          Name: updateproducts.Name,
          Quantity: updateproducts.Quantity,
          Price: updateproducts.Price,
          Supplier: updateproducts.Supplier,
          Image: updateproducts.Image,
          Email: updateproducts.Email,
          Description: updateproducts.Description,
        },
      };
      const products = await collection.updateOne(filter, updatedDoc, options);
      res.send(products);
    });
    // Delete products *https://healthy-health-warehouse.herokuapp.com/products/:id*-----------------------------------------------------------------------
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await collection.deleteOne(query);
      res.send(products);
    });
    // Product count *https://healthy-health-warehouse.herokuapp.com/productCount*---------------------------------------------------------------------------
    app.get("/productCount", async (req, res) => {
      const products = await collection.estimatedDocumentCount();
      res.send({ products });
    });
    //---------------------------------------------------------------------------
    app.post("/login", async (req, res) => {
      res.send({ success: true });
    });

    // ---------------------------------------------------------------------------
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("healthy-health-warehouse");
});
// ---------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
