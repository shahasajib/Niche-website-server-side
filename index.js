const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5000

// Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxyjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)

async function run() {
    try {
        await client.connect();
        // console.log("database connected sucessfully")
        const database = client.db("toyshop");
        const productsCollection = database.collection('products')
        const ordersCollection = database.collection('orders')
        const reviewCollection = database.collection('reviews')




        // Get all products
        app.get('/products', async (req, res) => {
            const products = productsCollection.find({})
            const cursor = await products.toArray()
            // console.log(cursor)
            res.send(cursor)
        })
        // Post produts
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            // console.log(result)
            res.json(result)
        })

        // Get Single Porducts
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            // console.log(product)
            res.json(product)
        })

        // Delete Api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        // Post Order
        app.post("/addOrders", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            // console.log(result)
            res.send(result);
        });


        // myOrders
        app.get("/myOrder/:email", async (req, res) => {
            console.log(req.params.email);
            const query = { email: req.params.email }
            const result = await ordersCollection
                .find(query)
                .toArray();
            console.log(result)
            res.send(result);
        });

        // Delete Api
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log(result)
            res.json(result);
        })



        // Review Post
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews)
            console.log(result)
            res.json(result)
        })
        // reviews Get
        app.get('/reviews', async (req, res) => {
            const reviews = reviewCollection.find({})
            const cursor = await reviews.toArray()
            // console.log(cursor)
            res.send(cursor)
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir)







app.get('/', (req, res) => {
    res.send("Get ready to the baby shop")
})

app.listen(port, () => {
    console.log("Running the server", port)
})