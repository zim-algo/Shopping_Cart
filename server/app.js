const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const router = require('./routes');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', router);

const server = app.listen(3001, ()=>{
    console.log('Server listening on port: ', server.address().port);
});