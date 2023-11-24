import React from 'react';
import mockIngredients from '../data/ingredients.json';

const IngredientRow = ({ ingredientId }) => {
    const ingredient = mockIngredients.find(ing => ing.id === ingredientId);
    const defaultMarkup = 2.5;
    // Placeholder for relativeAmount and absoluteAmount
    const relativeAmount = 0; // This will be dynamic based on user input
    const absoluteAmount = 0; // Calculated value based on formula

    // Placeholder for patientCost calculation
    const patientCost = ingredient.costPerGram * absoluteAmount * defaultMarkup;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '5px 0' }}>
            <span>{ingredient.name}</span>
            <span>{absoluteAmount}g</span>
            <span>${ingredient.costPerGram}/g</span>
            <span>{defaultMarkup}</span>
            <input 
                type="number" 
                value={relativeAmount} 
                // onChange handler will be needed here
            />
            <span>${patientCost.toFixed(2)}</span>
        </div>
    );
};

export default IngredientRow;
