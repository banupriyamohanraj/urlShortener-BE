require ("dotenv").config();
const router = require('express').Router();
const { MongoClient, ObjectID } = require('mongodb')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken')
const crypto = require('crypto');
const validUrl = require('valid-url');
const shortid = require('shortid');


const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'


router.post('/createurl',async (req,res)=>{
  
  try {
    let client = await MongoClient.connect(dbURL);
    let db = await client.db('url');
    let url = req.body.longurl;
    console.log(url)
    if(validUrl.isUri(url)){
        let baseUrl = "localhost:3000/"
      let short_id = shortid.generate();
      let shortUrl = baseUrl+short_id;
      console.log(shortUrl)
      await db.collection("url").insertOne({longurl : req.body.longurl,shortid: shortUrl});
      res.status('200').json({message:"Looks like URL"})
    }else{
        res.status("401").json({message:"Not an URL"})
    }
  } catch (error) {
      console.log(error)
      res.status(500).json({message:"Internal server error"})
  }


})

router.get('/list',async(req,res)=>{
   try {
    let client = await MongoClient.connect(dbURL);
    let db = await client.db('url');
let data= await db.collection("url").find().toArray();
if(data){
    let count = await db.collection('url').count();
    res.status(200).json(data);
}else{
    res.status(404).json({message:"data not found"})
}
   } catch (error) {
       console.log(error)
       res.status(500).json({message:"Internal server error"})
   }

})

router.get('/:urlid',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('url');
    await db.collection("url").findOne({shortid : req.params.urlid},function(err,data){
        if(err) throw err;
        res.redirect(data.longurl)
    })
 } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
  
})

module.exports = router;