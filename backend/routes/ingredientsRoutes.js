const express = require('express');
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "NourishingMedicineHerbalFormulaDB";
const collectionName = "Ingredients";

router.post('/ingredients', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        const result = await collection.insertOne(req.body);
        res.status(201).json({ message: "Ingredient added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Error adding ingredient: " + error.message });
    } finally {
        await client.close();
    }
});

router.get('/ingredients', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        const ingredients = await collection.find({}).toArray();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).send("Error fetching ingredients: " + error.message);
    } finally {
        await client.close();
    }
});

router.put('/ingredients/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
        res.status(200).send("Ingredient updated");
    } catch (error) {
        res.status(500).send("Error updating ingredient: " + error.message);
    } finally {
        await client.close();
    }
});

router.delete('/ingredients/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send("Ingredient deleted");
    } catch (error) {
        res.status(500).send("Error deleting ingredient: " + error.message);
    } finally {
        await client.close();
    }
});

module.exports = router;
