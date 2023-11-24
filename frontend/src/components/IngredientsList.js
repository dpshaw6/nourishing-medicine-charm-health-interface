import React, { useState } from 'react';
import mockIngredients from '../data/ingredients.json'; 

const IngredientsList = () => {
    const [ingredients, setIngredients] = useState(mockIngredients);

    return (
        <div>
            {ingredients.map(ingredient => (
                <div key={ingredient.id}>{ingredient.name} - ${ingredient.costPerGram}/g</div>
            ))}
        </div>
    );
}

export default IngredientsList;
