const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');
const session = require('express-session');

require('dotenv').config(); // load .env variables

const { server } = require('./api/server.js');

server.use(express.json());
server.use(cors());
server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}));

const port = process.env.PORT || 3300;

server.post('/register', (req, res) =>{
  const user = req.body;
  console.log('session', req.session);
  user.password = bcrypt.hashSync(user.password, 12);
  db('users').insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(err => {
    res.status(500).send(err)
  })
  
  
})

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port}\n`);
});
