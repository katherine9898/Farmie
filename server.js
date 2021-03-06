const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env'
});
const app = require('./app');

// Database path
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Connect the database
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connection successful');
}).catch(console.error);

// App listen to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});