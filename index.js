require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
require('./src/config/db');


const apiRoutes = require('./src/route/index'); 
let app = express();
app.use(cors({ origin: '*',  }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Running on port ' + port);
});
module.exports = app;

