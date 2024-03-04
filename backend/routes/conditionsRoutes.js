const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'NourishingMedicineHerbalFormulaDB';
const collectionName = 'Conditions';

// Get all conditions
router.get('/', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        const conditions = await collection.find({}).toArray();
        res.json(conditions);
    } catch (error) {
        res.status(500).send('Error fetching conditions: ' + error.message);
    } finally {
        await client.close();
    }
});

// Add a new condition
router.post('/', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        const result = await collection.insertOne(req.body);
        res.status(201).json({ message: 'Condition added', _id: result.insertedId }); // Send JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error adding condition: ' + error.message }); // Send JSON error message
    } finally {
        await client.close();
    }
});

// Update a condition
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
        if (result.modifiedCount === 0) {
            throw new Error("Condition not found or data unchanged");
        }
        res.status(200).json({ message: 'Condition updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating condition: ' + error.message });
    } finally {
        await client.close();
    }
});

// Delete a condition
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send('Condition deleted');
    } catch (error) {
        res.status(500).send('Error deleting condition: ' + error.message);
    } finally {
        await client.close();
    }
});

module.exports = router;
