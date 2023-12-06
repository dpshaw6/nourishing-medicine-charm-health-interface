const cors = require('cors');
const express = require('express');
const ingredientsRoutes = require('./routes/ingredientsRoutes');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.use('/api', ingredientsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
