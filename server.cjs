const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb')
const app = express()
const {connectToDb, getDb} = require('./dbConnection.cjs')
app.use(bodyParser.json())

let db;
connectToDb((error)=>{
    if(error){
        console.log("Could not establish connection");
    }

    else{
        app.listen(8000)
        db = getDb()
        console.log("success");
    }
})

app.post('/add-entry',(req,res)=>{
  db.collection('ExpressTrackerData').insertOne(req.body).then(()=>{
    res.status(201).json({
        "status":"Entry added successfully"
    })
  }).catch(()=>{
    res.status(500).json({
        "status":"Entry not added"
    })
  })
})

app.get('/get-entries',(req,res)=>{
  const entries = [];
  db.collection('ExpressTrackerData').find().forEach((el)=>{
    entries.push(el)
  }).then(()=>{
    res.status(201).json(entries)
  }).catch(()=>{
    res.status(404).json({
      "status":"File not found"
    })
  })
})
 
app.delete('/delete-entry',(req,res)=>{
  if(ObjectId.isValid(req.query.id)){
    db.collection('ExpressTrackerData').deleteOne({
      _id : new ObjectId(req.query.id)
    }).then(()=>{
      res.status(200).json({
        "status":"deleted successfully"
      }).catch(()=>{
        res.status(500).json({
          "status":"Not deleted "
        })
      })
    })
  }
  else{
    res.status(500).json({
      "status":"ObjectId is invalid"
    })
  }
})

app.patch('/update-entry/:id', function(request, response) {
  if(ObjectId.isValid(request.params.id)) {
      db.collection('ExpressTrackerData').updateOne(
          { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
          { $set : request.body } // The data to be updated
      ).then(function() {
          response.status(200).json({
              "status" : "Entry updated successfully"
          })
      }).catch(function() {
          response.status(500).json({
              "status" : "Unsuccessful on updating the entry"
          })
      })
  } else {
      response.status(500).json({
          "status" : "ObjectId not valid"
      })
  }
})
  