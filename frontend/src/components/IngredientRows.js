import React, { useState, useEffect } from 'react';
import IngredientRow from './IngredientRow';
import mockIngredients from '../data/ingredients.json';
import mockFormulas from '../data/formulas.json';

const IngredientRows = ({ selectedFormulaId }) => {
    const [ingredientRows, setIngredientRows] = useState([]);

    // Update ingredient rows when the selected formula changes
    useEffect(() => {
        if (selectedFormulaId) {
            const formula = mockFormulas.find(f => f.id === selectedFormulaId);
            const ingredientIds = formula ? Object.keys(formula.ingredientIds) : [];
            setIngredientRows(ingredientIds);
        } else {
            setIngredientRows([]);
        }
    }, [selectedFormulaId]);

    // Function to add a new ingredient row
    const addIngredientRow = () => {
        // Using the first ingredient as default for new rows
        setIngredientRows([...ingredientRows, mockIngredients[0].id]);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontWeight: 'bold', margin: '10px 0' }}>
                <span>Name</span>
                <span>Absolute Amount</span>
                <span>Cost/Gram</span>
                <span>Markup</span>
                <span>Relative Amount</span>
                <span>Patient Cost</span>
            </div>
            {ingredientRows.map(ingredientId => (
                <IngredientRow 
                    key={ingredientId} 
                    ingredientId={ingredientId}
                />
            ))}
            <button onClick={addIngredientRow}>Add Ingredient</button>
        </div>
    );
};

export default IngredientRows;
