import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv"
dotenv.config()

const client = mongodb.MongoClient
const port = process.env.PORT || 8000;

client.connect(
    process.env.DB_URI,
    {
        maxPoolSize:50,
        wtimeoutMS:300
    })
    .catch(err =>{
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        app.listen(port, () =>{
            console.log(`Listening on port ${port}`)
        })
    })
    