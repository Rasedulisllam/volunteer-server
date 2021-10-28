const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId= require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const app=express();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfrdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db('volunteer-net');
      const allEvents = database.collection('events');
      const allUserEvents = database.collection('userEvents');

      // add a new events data on database
      app.post('/events', async(req,res)=>{
        const data= req.body;
        const result= await allEvents.insertOne(data);
        res.json(result)
      })
      
    //  gets add events data
      app.get('/events', async( req, res)=>{
          const result= await allEvents.find({}).toArray();
          res.json(result)
      })


    //  gets a single events data
      app.get('/RegEvents', async( req, res)=>{
          const id=req.query.id;
          if(id){
            const query = {_id:ObjectId(id)};
            const result = await allEvents.findOne(query);
            res.json(result)
          }
          else{
            const result= await allUserEvents.find({}).toArray()
            res.json(result)
          }   
      })

    //  delete a single Registration events data
      app.delete('/RegEvents/:id', async( req, res)=>{
          const id=req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await allUserEvents.deleteOne(query);
          res.json(result)
      })

    //  gets my events list data
      app.get('/myEvents/:email', async( req, res)=>{
          const email=req.params.email;
          const query = {email:{$in:[email]}}
          const result= await allUserEvents.find(query).toArray();
          res.json(result)
      })

    // insart resistered events
    app.post('/registerEvent', async(req,res)=> {
        const data=req.body;
        const result= await allUserEvents.insertOne(data);
        res.json(result)
    })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('you are cunnecting')
})

app.listen(port,()=>{
    console.log('server running')
})