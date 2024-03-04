const express = require('express');
const cors = require('cors');
const ingredientsRoutes = require('./routes/ingredientsRoutes');
const conditionsRoutes = require('./routes/conditionsRoutes');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Use different base paths for each route
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/conditions', conditionsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
