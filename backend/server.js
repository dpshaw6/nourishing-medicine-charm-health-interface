const { MongoClient } = require("mongodb");
require('dotenv').config();

async function run() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("NourishingMedicineHerbalFormulaDB"); // Replace with your actual database name
        const collection = db.collection("Ingredients"); // Replace with your actual collection name

        // Add further operations here, like querying the database
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
