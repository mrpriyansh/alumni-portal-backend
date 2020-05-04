/* eslint-disable prettier/prettier */
const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const config = require('../utils/config');

const router = express.Router();
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const allUsers = require('./controllers/allUsers');
const userAuth = require('./middlewares/user-auth');
const verifyAdmin = require('./middlewares/verifyAdmin');
const isAdminVerified=require('./middlewares/isAdminVerified.js');
const isEmailVerified=require('./middlewares/isEmailVerified');
const emailVerification=require('./controllers/emailVerification');
const adminVerification=require('./controllers/adminVerification');
const instituteEmailVerification=require('./controllers/instituteEmailVerification');
const showAdmin=require('./controllers/showAdmin');
const uploadPost = require('./controllers/uploadPost');
const comments = require('./controllers/comments');
const replies = require('./controllers/replies');
const fetchcomment = require('./controllers/fetchcomment');
const userDetails = require('./controllers/userDetails');
const uploadImage = require('./controllers/uploadImage');
const fetchPosts = require('./controllers/fetchPosts');
const profile = require('./controllers/profile');
const sendMail=require('./controllers/sendMail');
const rejectUser = require('./controllers/rejectUser');

const url = config.host;


MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  }
  // eslint-disable-next-line no-console
  console.log('Database connected successfully!');
  const db = client.db(config.dbName);


  router.get('/', (req, res) => res.send('welcome'));

  router.post('/signup', (req, res) => {
    signup.handleSignup(req, res, db, client);
  });
  
  // verifying email route
  router.get('/verifyEmail/:token',async(req,res)=>{
   emailVerification(req,res,db);
  });

  router.get('/resendEmail',async(req,res)=>{
    sendMail(req,res,db,'');
  });

  router.get('/resendinstituteEmail',async(req,res)=>{
    sendMail(req,res,db,'institute');
  });

  // verifying Institute email route
  router.get('/verifyInstituteEmail/:token',async(req,res)=>{
    instituteEmailVerification(req,res,db);             // Bcz we know this will only called for userType=student
   });

  router.post('/uploadimage', userAuth, (req,res)=>{
    uploadImage(req, res, db);
  })
  router.get('/fetchposts/:id', (req,res)=>{
    fetchPosts(req,res,db);
  })
  router.post('/login', isEmailVerified(db) ,isAdminVerified(db),(req, res) => {
    login(req, res, db);
  });
  router.get('/profile/:profileId', (req,res)=>{
    profile(req, res, db);
  })
  router.get('/userdetails', userAuth, (req, res) => {
    userDetails(req, res, db);
  });
  router.post('/uploadPost', userAuth, (req, res) => {
    uploadPost(req, res, db, client);
  });
  router.get('/admin', [userAuth, verifyAdmin(db)], async (req, res) => {
    showAdmin(req,res,db);
  });
  // verifying user by deleting userID from admins->userToVerify array and setting isAdminVerified Field true
  router.get('/admin/confirm/:userId', [userAuth, verifyAdmin(db)] , async (req, res) => {
    adminVerification(req,res,db,client);
  });
  // deleting user by deleting userID from admins-> userToVerify array
  router.get('/admin/delete/:userId', [userAuth, verifyAdmin(db)], async (req, res) => {
     rejectUser(req,res,db);
  });

  // members page and admin page
  router.get('/users', [userAuth,verifyAdmin(db)], (req, res) => {
   allUsers(req, res, db);
  });

  router.get('/posts/:postID', userAuth, async (req, res) => {
    const post = await db.collection('posts').findOne({ _id: req.params.postID });
    res.status(200).send(post);
  });
  router.get('/user/:userID', userAuth, async (req, res) => {
    const user = await db
      .collection('users')
      .find({ _id: ObjectID(req.params.userID) })
      .toArray();
    res.send(user);
  });
  // implementing comments
  router.post('/posts/:postID/comments', userAuth, (req, res) => {
    comments(req, res, db, client);
  });

  // eslint-disable-next-line prettier/prettier
  router.post('/posts/:postID/:commentID/replies', userAuth, (req,res,next) =>{
      comments(req, res, db);
      next();
      // eslint-disable-next-line prettier/prettier
  }, (req,res) => {replies(req,res,db);});

  // fetching comments of a post
  router.get('/posts/:postID/comment', userAuth, (req, res) => {
    fetchcomment(req, res, db);
  });
});

module.exports = router;
