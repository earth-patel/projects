require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from Auth Server');
});

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
