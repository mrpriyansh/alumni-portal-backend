/* eslint-disable prettier/prettier */
const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const config = require('../utils/config');

const router = express.Router();
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const indiUser = require('./controllers/user');
const userAuth = require('./middlewares/user-auth');
const verifyAdmin = require('./middlewares/verifyAdmin');
const uploadPost = require('./controllers/uploadPost');
const comments = require('./controllers/comments');
const replies = require('./controllers/replies');
const fetchcomment = require('./controllers/fetchcomment');
const userDetails = require('./controllers/userDetails');
const uploadImage = require('./controllers/uploadImage');

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
    signup.handleSignup(req, res, db);
  });
  router.post('/uploadimage', userAuth, (req,res)=>{
    uploadImage(req, res, db);
  })
  router.post('/login', (req, res) => {
    login(req, res, db);
  });
  router.get('/admin', userAuth, verifyAdmin(db), async (req, res) => {
    const userToBeVerifiedID = await db
      .collection('admins')
      .find({})
      .toArray();
    const users = await db
      .collection('users')
      .find({})
      .toArray();
    const userToBeVerified = users.filter(user =>
      userToBeVerifiedID[0].usersToVerify.toString().includes(user._id)
    );
    res.status(200).send(userToBeVerified);
  });
  // verifying user by deleting userID from admins->userToVerify array and setting isVerified Field true
  router.get('/admin/confirm/:userID', userAuth, verifyAdmin(db), async (req, res) => {
    await db
      .collection('admins')
      .updateOne({}, { $pull: { usersToVerify: ObjectID(req.params.userID) } });
    await db
      .collection('users')
      .findOneAndUpdate({ _id: ObjectID(req.params.userID) }, { $set: { isVerified: true } });
    res.send('user succesfully verified by admin');
  });
  // deleting user by deleting userID from admins-> userToVerify array
  router.get('/admin/delete/:userID', userAuth, verifyAdmin(db), async (req, res) => {
    await db
      .collection('admins')
      .updateOne({}, { $pull: { usersToVerify: ObjectID(req.params.userID) } });
    res.send('user not verfied by admin and successfully deleted from database');
  });

  router.get('/user', userAuth, (req, res) => {
    indiUser(req, res, db);
  });

  router.get('/userdetails', userAuth, (req, res) => {
    userDetails(req, res, db);
  });
  router.post('/uploadPost', userAuth, (req, res) => {
    uploadPost(req, res, db);
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
    comments(req, res, db);
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
