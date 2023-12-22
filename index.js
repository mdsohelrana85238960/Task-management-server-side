const express = require('express')

require('dotenv').config()
const app = express();
const cors = require('cors');
const { ObjectId,MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nliodki.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    

    const TasksCollection = client.db("tasksMG").collection("tasks");


    app.post('/tasks' , async(req, res) =>{
      const tasks = req.body
      const result = await TasksCollection.insertOne(tasks);
      res.send(result)
    })


    app.get('/tasks/:email', async(req,res) => {
      const email = req.params.email;
    const query = {email:email}
    
      const result = await TasksCollection.find(query).toArray();
      console.log(result)
      res.send(result)
  })



    app.get('/singleTasks/:id',async(req,res) => {
      const id = req.params.id
      
      const query = { _id: new ObjectId(id) }
      const result = await TasksCollection.findOne(query);
      res.send(result) 
  })

   

    app.delete('/tasks/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await TasksCollection.deleteOne(query)
      res.send(result);
    })

    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
     
      const filter = { _id: new ObjectId(id) };
      
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          title: data.title,
          priority: data.priority,
          description: data.description,
          
        },
      };
      const result = await TasksCollection.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('task manage running')
})

app.listen(port, () => {
    console.log(`Task management server is running on port ${port}`)
})