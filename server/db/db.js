const { MongoClient } = require('mongodb')

const uri = "mongodb+srv://achan8200:achan@calendar.mzatqe5.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

let connection

try {
    connection = await client.connect()
} catch (e) {
    console.error(e);
}

let db = connection.db("Calendar")

export default db

