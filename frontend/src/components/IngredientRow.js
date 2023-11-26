import React from 'react';
import mockIngredients from '../data/ingredients.json';

const IngredientRow = ({ rowId, ingredientId, relativeAmount, totalMass, totalRelativeAmount, onRelativeAmountChange, onDelete, onIngredientChange }) => {
    const ingredient = mockIngredients.find(ing => ing.id === ingredientId);
    const defaultMarkup = 2.5; // Default markup
    const markup = defaultMarkup; // This can be dynamic if override is implemented

    const handleRelativeAmountChange = (e) => {
        onRelativeAmountChange(Number(e.target.value));
    };

    const handleIngredientSelection = (e) => {
        onIngredientChange(e.target.value);
    };

    // Calculate Absolute Amount
    const absoluteAmount = totalRelativeAmount > 0
                            ? (relativeAmount / totalRelativeAmount) * totalMass
                            : 0;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '5px 0' }}>
            <select value={ingredientId} onChange={handleIngredientSelection}>
                {mockIngredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
            </select>
            <span>{absoluteAmount.toFixed(2)}g</span>
            <span>${ingredient.costPerGram}/g</span>
            <span>{markup}</span>
            {/* Placeholder for Override Checkbox */}
            <input type="checkbox" />
            <input 
                type="number" 
                value={relativeAmount} 
                onChange={handleRelativeAmountChange}
            />
            {/* Placeholder for Provider Cost */}
            <span>$0.00</span>
            {/* Placeholder for Patient Cost */}
            <span>$0.00</span>
            <button onClick={() => onDelete(rowId)}>Delete</button>
        </div>
    );
};

export default IngredientRow;
