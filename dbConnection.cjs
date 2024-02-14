const {MongoClient}= require('mongodb') 

// for selecting the particular thing(object) from a package use {}


let dbConnection;                        // variable for storing the data that stored in mongodb
function connectToDb(callback){
   MongoClient.connect('mongodb+srv://nalan:nalanahathavan@cluster0.njy4tcm.mongodb.net/?retryWrites=true&w=majority').then((client)=>{
    dbConnection =client.db();
    callback();
  
    }).catch((error)=>{
        callback(error)
    })
}
function getDb(){
    return dbConnection
}


module.exports ={connectToDb,getDb}
