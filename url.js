require("dotenv").config();
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

router.get('/allurlcount',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('url');
        let data = await db.collection("url").find().toArray();
        if(data)
        {
            let count = await db.collection('url').count();
            res.status(200).json(count);
        }else {
            res.status(404).json({ message: "data not found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

router.post('/date/count',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('url');
        let data = await db.collection("url").find({date:{$gte:new Date(req.body.date)}}).toArray();
        if(data)
        {
          
            res.status(200).json({message:"found the data",data});
        }else {
            res.status(404).json({ message: "Please select a different Date" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

router.post('/createurl', async (req, res) => {

    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('url');
        let url = req.body.longurl;
        console.log(url)
        if (validUrl.isUri(url)) {

            let short_id = shortid.generate();
            let date = 
            await db.collection("url").insertOne({ longurl: req.body.longurl, shortid: short_id ,date : new Date()});


            res.status('200').json({ message: "Short Url is created !!" })

        } else {
            res.status("401").json({ message: "Not an URL" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }


})

router.get('/list', async (req, res) => {
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('url');
        let data = await db.collection("url").find().toArray();
        if (data) {
           
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "data not found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }

})



router.get('/:urlid', async (req, res) => {
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('url');
        let data = await db.collection("url").findOne({ shortid: req.params.urlid })
            if(data){
                res.redirect(data.longurl)
                res.status(200).json({message:"found",data})
            }
            else {
                res.status(404).json({ message: "not found" })
            }  
            client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }

})




module.exports = router;