import React, { useState } from 'react';

const IngredientRow = ({ 
    rowId, 
    ingredientId, 
    relativeAmount, 
    amountType, 
    calculatedAbsoluteAmount, 
    inputAbsoluteAmount, 
    onRelativeAmountChange, 
    onDelete, 
    onIngredientChange, 
    onAbsoluteAmountChange, 
    ingredients,
    overrideMarkup,
    markup,
    onMarkupChange,
    onEditIngredient
}) => {
    const isRelativeDisabled = amountType === 'absolute';

    // Find the selected ingredient from the fetched ingredients
    const ingredient = ingredients.find(ing => ing._id === ingredientId);

    // Check if a valid ingredient is selected
    const isValidIngredient = ingredient && ingredientId !== '';

    const handleRelativeAmountChange = (e) => {
        onRelativeAmountChange(Number(e.target.value));
    };

    const handleIngredientSelection = (e) => {
        onIngredientChange(e.target.value);
    };

    const handleMarkupChange = (e) => {
        const newMarkup = Number(e.target.value);
        onMarkupChange(rowId, 'markup', newMarkup);
    };

    const handleOverrideChange = () => {
        onMarkupChange(rowId, 'overrideMarkup', !overrideMarkup);
    };

    const handleAbsoluteAmountChange = (e) => {
        onAbsoluteAmountChange(Number(e.target.value));
    };

    const sortedIngredients = [...ingredients].sort((a, b) => {
        // Assuming 'name' is the property to sort by
        return a.name.localeCompare(b.name);
    });    

    const displayedAbsoluteAmount = amountType === 'relative' ? calculatedAbsoluteAmount : inputAbsoluteAmount;

    // Calculate Provider Cost
    const providerCost = isValidIngredient ? displayedAbsoluteAmount * ingredient.costPerGram : 0;

    // Calculate Patient Cost
    const patientCost = isValidIngredient ? providerCost * markup : 0;

    return (
        <tr>
            <td>
                <select value={ingredientId} onChange={handleIngredientSelection}>
                    <option value="" disabled>Choose Ingredient...</option>
                    {sortedIngredients.map(ingredient => (
                        <option key={ingredient._id} value={ingredient._id}>
                            {ingredient.name}
                        </option>
                    ))}
                </select>
                <button onClick={() => onEditIngredient(rowId)}>
                    {ingredientId ? 'Edit' : 'Add New'}
                </button>
            </td>
            <td style={{ backgroundColor: '#FFFF99' }}>
                <input 
                    type="number" 
                    value={displayedAbsoluteAmount.toFixed(1)}
                    onChange={handleAbsoluteAmountChange}
                    disabled={amountType === 'relative'}
                    style={{ fontWeight: 'bold' }}
                />
            </td>
            <td>
                <input 
                    type="number" 
                    value={relativeAmount} 
                    onChange={handleRelativeAmountChange}
                    disabled={isRelativeDisabled}
                />
            </td>
            <td>
                {ingredient ? `$${ingredient.costPerGram.toFixed(2)}/g` : 'N/A'}
            </td>
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
            <td>${providerCost.toFixed(2)}</td>
            <td>${patientCost.toFixed(2)}</td>
            <td>
                <button onClick={() => onDelete(rowId)}>Delete</button>
            </td>
        </tr>
    );
};

export default IngredientRow;
