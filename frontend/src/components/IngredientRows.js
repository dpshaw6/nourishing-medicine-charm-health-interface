import React, { useState, useEffect } from 'react';
import IngredientRow from './IngredientRow';
import mockFormulas from '../data/formulas.json';

const IngredientRows = ({ selectedFormulaId, totalMass }) => {
    const [rowsData, setRowsData] = useState([]);
    const [ingredients, setIngredients] = useState([]); // New state for real ingredients
    const [amountType, setAmountType] = useState('relative');

    useEffect(() => {
        // Fetch real ingredients from backend
        fetch('http://localhost:3001/api/ingredients')
            .then(response => response.json())
            .then(data => setIngredients(data))
            .catch(error => console.error('Error fetching ingredients:', error));
    
        if (selectedFormulaId) {
            const formula = mockFormulas.find(f => f.id === selectedFormulaId);
            // Assuming ingredientIds in the formula is an array of ingredient IDs
            const ingredientIds = formula ? formula.ingredientIds : [];
            setRowsData(ingredientIds.map(ingredientId => ({
                id: `row-${ingredientId}`,
                ingredientId: ingredientId,
                relativeAmount: 0,
                inputAbsoluteAmount: 0 // initialize input absolute amount
            })));
        } else {
            setRowsData([]);
        }
    }, [selectedFormulaId]);

    const addIngredientRow = () => {
        // Use the first real ingredient's ID if available
        const firstIngredientId = ingredients.length > 0 ? ingredients[0]._id : null;

        const newRow = {
            id: `row-${Date.now()}`,
            ingredientId: '', // Set to empty string for placeholder
            relativeAmount: 0,
            inputAbsoluteAmount: 0 // initialize input absolute amount
        };
    
        setRowsData([...rowsData, newRow]);
    };

    const deleteIngredientRow = (rowId) => {
        setRowsData(rowsData.filter(row => row.id !== rowId));
    };

    const updateRowData = (rowId, field, value) => {
        const updatedRows = rowsData.map(row => 
            row.id === rowId ? { ...row, [field]: value } : row
        );
        setRowsData(updatedRows);
    };

    const calculateTotalRelativeAmount = () => {
        return rowsData.reduce((total, row) => total + row.relativeAmount, 0);
    };

    const totalRelativeAmount = calculateTotalRelativeAmount();
    
    const handleAmountTypeChange = (event) => {
        setAmountType(event.target.value);
    };

    const handleAbsoluteAmountChange = (rowId, newAmount) => {
        setRowsData(rowsData.map(row => 
            row.id === rowId ? { ...row, inputAbsoluteAmount: newAmount } : row
        ));
    };
    
    // Calculate total provider cost and total patient cost
    const calculateTotals = () => {
        let totalProviderCost = 0;
        let totalPatientCost = 0;

        rowsData.forEach(row => {
            const ingredient = ingredients.find(ing => ing._id === row.ingredientId);
            
            // Determine the effective absolute amount based on the current mode
            let effectiveAbsoluteAmount;
            if (amountType === 'relative') {
                effectiveAbsoluteAmount = totalRelativeAmount > 0
                                            ? (row.relativeAmount / totalRelativeAmount) * totalMass
                                            : 0;
            } else {
                effectiveAbsoluteAmount = row.inputAbsoluteAmount;
            }

            const providerCost = effectiveAbsoluteAmount * (ingredient ? ingredient.costPerGram : 0);
            const patientCost = providerCost * (row.overrideMarkup ? row.markup : 2.5);

            totalProviderCost += providerCost;
            totalPatientCost += patientCost;
        });

        return { totalProviderCost, totalPatientCost };
    };

    const { totalProviderCost, totalPatientCost } = calculateTotals();

    return (
        <table style={{ width: '100%', textAlign: 'center' }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>
                        <input 
                            type="radio" 
                            value="absolute" 
                            checked={amountType === 'absolute'}
                            onChange={handleAmountTypeChange}
                        />Absolute Amount</th>
                    <th>
                        <input 
                            type="radio" 
                            value="relative" 
                            checked={amountType === 'relative'}
                            onChange={handleAmountTypeChange}
                        />Ingredient Ratio</th>
                    <th>Cost/Gram</th>
                    <th>Override</th>
                    <th>Markup</th>
                    <th>Provider Cost</th>
                    <th>Patient Cost</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {rowsData.map(row => (
                    <IngredientRow 
                        key={row.id}
                        rowId={row.id}
                        ingredientId={row.ingredientId}
                        relativeAmount={row.relativeAmount}
                        calculatedAbsoluteAmount={totalRelativeAmount > 0
                            ? (row.relativeAmount / totalRelativeAmount) * totalMass
                            : 0}
                        inputAbsoluteAmount={row.inputAbsoluteAmount || 0}
                        onAbsoluteAmountChange={(newAmount) => handleAbsoluteAmountChange(row.id, newAmount)}
                        amountType={amountType}
                        totalRelativeAmount={totalRelativeAmount}
                        onRelativeAmountChange={(newAmount) => updateRowData(row.id, 'relativeAmount', newAmount)}
                        onDelete={() => deleteIngredientRow(row.id)}
                        onIngredientChange={(newIngredientId) => updateRowData(row.id, 'ingredientId', newIngredientId)}
                        ingredients={ingredients}
                    />
                ))}
                <tr>
                    <td colSpan={5}></td>
                    <td>Total</td>
                    <td>${totalProviderCost.toFixed(2)}</td>
                    <td>${totalPatientCost.toFixed(2)}</td>
                    <td>
                        <button onClick={addIngredientRow}>Add Ingredient</button>
                    </td>
                </tr>
            </tbody>
        </table>    );
};

export default IngredientRows;
