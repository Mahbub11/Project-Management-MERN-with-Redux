import express from "express";
import api from './routes/index.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";

dotenv.config()
mongoose
.connect(process.env.MONGODB_PATH, {
  dbName: 'todo',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((data) => {
  console.log(`mongod connected with server: ${data.connection.host}`);
});


const PORT = process.env.SERVER_PORT || 9000
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000'

const app = express()
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// app.use(cors({
//     origin
// }));
app.use(express.json())
app.use(express.urlencoded())

app.use(api)

app.listen(PORT, () => {
    console.log(`Your app is running in http://localhost:${PORT}`)
})