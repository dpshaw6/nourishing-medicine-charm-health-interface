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
        <tr>
            <td>
                <select value={ingredientId} onChange={handleIngredientSelection}>
                    {mockIngredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                </select>
            </td>
            <td>{absoluteAmount.toFixed(2)}g</td>
            <td>${ingredient.costPerGram.toFixed(2)}/g</td>
            <td>
                <input 
                    type="checkbox" 
                    checked={overrideMarkup}
                    onChange={handleOverrideChange}
                />
            </td>
            <td>
                <input 
                    type="number"
                    value={markup}
                    onChange={handleMarkupChange}
                    disabled={!overrideMarkup}
                />
            </td>
            <td>
                <input 
                    type="number" 
                    value={relativeAmount} 
                    onChange={handleRelativeAmountChange}
                />
            </td>
            <td>${providerCost.toFixed(2)}</td>
            <td>${patientCost.toFixed(2)}</td>
            <td>
                <button onClick={() => onDelete(rowId)}>Delete</button>
            </td>
        </tr>
    );
};

export default IngredientRow;
