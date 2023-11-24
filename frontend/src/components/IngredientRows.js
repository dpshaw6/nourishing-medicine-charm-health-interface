import React, { useState } from 'react';
import mockIngredients from '../data/ingredients.json';

const IngredientRow = ({ ingredientId, onDelete }) => {
    const ingredient = mockIngredients.find(ing => ing.id === ingredientId);
    return (
        <div>
            <span>{ingredient.name}</span>
            <button onClick={() => onDelete(ingredientId)}>Delete</button>
        </div>
    );
};

const IngredientRows = () => {
    const [ingredientRows, setIngredientRows] = useState([]);

    const addIngredientRow = () => {
        // Add a new ingredient row with a default ingredient ID
        setIngredientRows([...ingredientRows, mockIngredients[0].id]);
    };

    const deleteIngredientRow = (ingredientId) => {
        setIngredientRows(ingredientRows.filter(id => id !== ingredientId));
    };

    return (
        <div>
            {ingredientRows.map(ingredientId => (
                <IngredientRow 
                    key={ingredientId} 
                    ingredientId={ingredientId} 
                    onDelete={deleteIngredientRow} 
                />
            ))}
            <button onClick={addIngredientRow}>Add Ingredient</button>
        </div>
    );
};

export default IngredientRows;
