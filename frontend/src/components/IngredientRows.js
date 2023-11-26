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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontWeight: 'bold', margin: '10px 0' }}>
                {/* Column headers */}
                <span>Name</span>
                <span>Absolute Amount</span>
                <span>Cost/Gram</span>
                <span>Markup</span>
                <span>Override</span>
                <span>Relative Amount</span>
                <span>Provider Cost</span>
                <span>Patient Cost</span>
                <span>Action</span>
            </div>
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
            <button onClick={addIngredientRow}>Add Ingredient</button>
        </div>
    );
};

export default IngredientRows;
