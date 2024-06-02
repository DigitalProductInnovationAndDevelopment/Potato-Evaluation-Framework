const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet');
const connectDB = require("./database/db")
const routes = require("./routes/routes")


const port = process.env.PORT || 8080;

//connection to database
connectDB();

//middlewares
app.use(cors())
app.use(helmet());
app.use(bodyParser.json());


//routes
app.use('/', routes);

app.get('/', (req, res) => {
  res.send('Home page');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
