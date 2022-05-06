const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtctp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
    // get api---------------------------------------------------------------------------
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    // create api---------------------------------------------------------------------------
    app.post("/products", async (req, res) => {
      const newproducts = req.body;
      const products = await collection.insertOne(newproducts);
      res.send(products);
    });
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
