const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jd8zyik.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const collegeBooking = client.db('collegeBooking').collection('college');
        // const admissionCollection = client.db(collegeBooking).collection('admission');


        // all data
        app.get('/college', async (req, res) => {
            const cursor = collegeBooking.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // admission
        // app.post('/admission', async (req, res) => {
        //     const admission = req.body;
        //     console.log(admission);
        //     // const result = await admissionCollection.insertOne(admission);
        //     // res.send(result);
        // });


        app.get('/college/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { college_image: 1, college_name: 1, events_details: 1, admission_process: 1, research_works: 1, sports: 1, events: 1, _id: 1 },
            };

            const result = await collegeBooking.findOne(query, options);
            res.send(result);
        })

        // 3 sorted data 
        app.get('/colleges', async (req, res) => {
            try {
                const db = client.db('collegeBooking');
                const collegesCollection = db.collection('college');

                const colleges = await collegesCollection.find({}).limit(3).toArray();
                res.json(colleges);
            } catch (err) {
                console.error('Error fetching colleges:', err);
                res.status(500).json({ error: 'An error occurred while fetching colleges.' });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('College Booking ready')
})

app.listen(port, () => {
    console.log('College Booking server is ready')
})