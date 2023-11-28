import React, { useState, useEffect } from 'react';
import IngredientRow from './IngredientRow';
import mockIngredients from '../data/ingredients.json';
import mockFormulas from '../data/formulas.json';

const IngredientRows = ({ selectedFormulaId, totalMass }) => {
    const [rowsData, setRowsData] = useState([]);

    useEffect(() => {
        if (selectedFormulaId) {
            const formula = mockFormulas.find(f => f.id === selectedFormulaId);
            const ingredientIds = formula ? Object.keys(formula.ingredientIds) : [];
            setRowsData(ingredientIds.map(id => ({ id: `row-${id}`, ingredientId: id, relativeAmount: 0 })));
        } else {
            setRowsData([]);
        }
    }, [selectedFormulaId]);

    const addIngredientRow = () => {
        const newRow = {
            id: `row-${Date.now()}`,
            ingredientId: mockIngredients[0].id,
            relativeAmount: 0
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

    // Calculate total provider cost and total patient cost
    const calculateTotals = () => {
        let totalProviderCost = 0;
        let totalPatientCost = 0;

        rowsData.forEach(row => {
            const ingredient = mockIngredients.find(ing => ing.id === row.ingredientId);
            const absoluteAmount = totalRelativeAmount > 0
                                    ? (row.relativeAmount / totalRelativeAmount) * totalMass
                                    : 0;
            const providerCost = absoluteAmount * ingredient.costPerGram;
            const patientCost = providerCost * (row.overrideMarkup ? row.markup : 2.5); // Assuming 2.5 is the default markup

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
                    <th>Absolute Amount</th>
                    <th>Ingredient Ratio</th>
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
                        totalMass={totalMass}
                        totalRelativeAmount={totalRelativeAmount}
                        onRelativeAmountChange={(newAmount) => updateRowData(row.id, 'relativeAmount', newAmount)}
                        onDelete={() => deleteIngredientRow(row.id)}
                        onIngredientChange={(newIngredientId) => updateRowData(row.id, 'ingredientId', newIngredientId)}
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
