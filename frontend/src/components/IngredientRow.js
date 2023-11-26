import React, { useState } from 'react';
import mockIngredients from '../data/ingredients.json';

const IngredientRow = ({ rowId, ingredientId, relativeAmount, totalMass, totalRelativeAmount, onRelativeAmountChange, onDelete, onIngredientChange }) => {
    const [overrideMarkup, setOverrideMarkup] = useState(false);
    const [markup, setMarkup] = useState(2.5); // Default markup

    const ingredient = mockIngredients.find(ing => ing.id === ingredientId);

    const handleRelativeAmountChange = (e) => {
        onRelativeAmountChange(Number(e.target.value));
    };

    const handleIngredientSelection = (e) => {
        onIngredientChange(e.target.value);
    };

    const handleMarkupChange = (e) => {
        setMarkup(Number(e.target.value));
    };

    const handleOverrideChange = () => {
        setOverrideMarkup(!overrideMarkup);
        if (!overrideMarkup) {
            setMarkup(2.5); // Reset to default if override is unchecked
        }
    };

    // Calculate Absolute Amount
    const absoluteAmount = totalRelativeAmount > 0
                            ? (relativeAmount / totalRelativeAmount) * totalMass
                            : 0;

    // Calculate Provider Cost
    const providerCost = absoluteAmount * ingredient.costPerGram;

    // Calculate Patient Cost
    const patientCost = providerCost * markup;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '5px 0' }}>
            <select value={ingredientId} onChange={handleIngredientSelection}>
                {mockIngredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
            </select>
            <span>{absoluteAmount.toFixed(2)}g</span>
            <span>${ingredient.costPerGram}/g</span>
            <input 
                type="checkbox" 
                checked={overrideMarkup}
                onChange={handleOverrideChange}
            />
            <input 
                type="number"
                value={markup}
                onChange={handleMarkupChange}
                disabled={!overrideMarkup}
            />
            <input 
                type="number" 
                value={relativeAmount} 
                onChange={handleRelativeAmountChange}
            />
            <span>${providerCost.toFixed(2)}</span>
            <span>${patientCost.toFixed(2)}</span>
            <button onClick={() => onDelete(rowId)}>Delete</button>
        </div>
    );
};

export default IngredientRow;
