const express = require('express')
require('dotenv').config()
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdfwpbk.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("contract");
        const userCollection = database.collection("users");


        app.post('/users', async (req, res) => {
            const result = await userCollection.insertOne(req.body)
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            const result = await userCollection.find({ userEmail: req.query.email }).toArray()
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...req.body
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const result = await userCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

    
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})