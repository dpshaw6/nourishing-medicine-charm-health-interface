import React, { useState, useEffect } from 'react';
import IngredientRow from './IngredientRow';
import IngredientPopup from './IngredientPopup';
import mockFormulas from '../data/formulas.json';

const IngredientRows = ({ selectedFormulaId, totalMass, patientName, conditionName }) => {
    const [rowsData, setRowsData] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [amountType, setAmountType] = useState('relative');
    const [totalPatientCost, setTotalPatientCost] = useState(0);
    const [totalProviderCost, setTotalProviderCost] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState(null);
    const [formulaName, setFormulaName] = useState(""); // Initialize with an empty string
    const [dosage, setDosage] = useState("3 scoops twice a day"); // Default dosage
    
    useEffect(() => {
        // Fetch ingredients from backend
        fetch('http://localhost:3001/api/ingredients')
            .then(response => response.json())
            .then(data => setIngredients(data))
            .catch(error => console.error('Error fetching ingredients:', error));
    
        if (selectedFormulaId) {
            const formula = mockFormulas.find(f => f.id === selectedFormulaId);
            // Ensure ingredientIds is an array before proceeding
            const ingredientIds = Array.isArray(formula?.ingredientIds) ? formula.ingredientIds : [];
            setRowsData(ingredientIds.map(ingredientId => ({
                id: `row-${ingredientId}`,
                ingredientId: ingredientId,
                relativeAmount: 0,
                inputAbsoluteAmount: 0 // Initialize input absolute amount
            })));
        } else {
            setRowsData([]);
        }
    }, [selectedFormulaId]);    

    useEffect(() => {
        let newTotalProviderCost = 0;
        let newTotalPatientCost = 0;
        let totalRelativeAmount = rowsData.reduce((total, row) => total + row.relativeAmount, 0);

        rowsData.forEach(row => {
            const ingredient = ingredients.find(ing => ing._id === row.ingredientId);
            if (ingredient) {
                const effectiveAbsoluteAmount = amountType === 'relative' 
                    ? (totalRelativeAmount > 0 ? (row.relativeAmount / totalRelativeAmount) * totalMass : 0)
                    : row.inputAbsoluteAmount;
                const providerCost = effectiveAbsoluteAmount * ingredient.costPerGram;
                const patientCost = providerCost * row.markup;

                newTotalProviderCost += providerCost;
                newTotalPatientCost += patientCost;
            }
        });

        setTotalProviderCost(newTotalProviderCost);
        setTotalPatientCost(newTotalPatientCost);
    }, [rowsData, ingredients, totalMass, amountType]);
    
    const onEditIngredient = (rowId) => {
        const row = rowsData.find(r => r.id === rowId);
        const ingredientToEdit = ingredients.find(ing => ing._id === row.ingredientId);
        setCurrentIngredient(ingredientToEdit || null); // If no ingredient is selected, set to null
        setIsPopupOpen(true);
    };

    const fetchIngredients = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/ingredients');
            const data = await response.json();
            setIngredients(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };
    
    const addIngredientRow = () => {
        const newRow = {
            id: `row-${Date.now()}`,
            ingredientId: '', // Set to empty string for placeholder
            relativeAmount: 0,
            inputAbsoluteAmount: 0, // initialize input absolute amount
            markup: 3.0, // Default markup
            overrideMarkup: false // Default override state
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

    const handleIngredientSave = async (ingredientData) => {
        if (currentIngredient) {
            const response = await fetch(`http://localhost:3001/api/ingredients/${currentIngredient._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ingredientData),
            });
        } else {
            try {
                const response = await fetch('http://localhost:3001/api/ingredients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ingredientData),
                });
    
                if (response.ok) {
                    const newIngredient = await response.json();
                    setIngredients([...ingredients, newIngredient]);
                } else {
                    // Handle errors
                    console.error('Failed to add ingredient');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
        // After saving, close the pop-up and refresh the ingredients list
        setIsPopupOpen(false);
        // Refresh ingredients list logic here
        fetchIngredients();
    }; 

    const copyFormulaToClipboard = () => {
        const formulaTitle = formulaName?.trim() || "Untitled Formula";
        const dosageInstructions = dosage?.trim() || "3 scoops twice a day";
        const currentDate = new Date().toLocaleDateString();

        let formulaData = `Patient: ${patientName || "Unknown"}\n`;
        formulaData += `Date: ${currentDate}\n`;
        formulaData += `Condition: ${conditionName || "Unknown"}\n`;
        formulaData += `Formula: ${formulaTitle}\n`;
        formulaData += `Dosage: ${dosageInstructions}\n\n`;
        formulaData += "Name\tAmount (g)\tPercentage (%)\n";
    
        // Process ingredients
        rowsData.forEach(row => {
            const ingredient = ingredients.find(ing => ing._id === row.ingredientId);
            if (ingredient) {
                // Calculate absolute amount
                let absoluteAmount = 0;
                if (amountType === 'relative' && totalRelativeAmount > 0) {
                    absoluteAmount = (row.relativeAmount / totalRelativeAmount) * totalMass;
                } else if (amountType === 'absolute') {
                    absoluteAmount = row.inputAbsoluteAmount;
                }
    
                // Calculate percentage
                const percentage = totalMass > 0 ? (absoluteAmount / totalMass) * 100 : 0;
    
                // Append to output
                formulaData += `${ingredient.name}\t${absoluteAmount.toFixed(2)}\t${percentage.toFixed(2)}%\n`;
            }
        });
    
        // Copy to clipboard
        navigator.clipboard.writeText(formulaData)
            .then(() => {
                console.log('Formula copied to clipboard successfully');
            })
            .catch(err => {
                console.error('Error copying formula to clipboard:', err);
            });
    };
        
    return (
        <div>
            {/* Formula Name Input */}
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <label>
                    Formula Name:&nbsp;
                    <input 
                        type="text" 
                        value={formulaName} 
                        onChange={(e) => setFormulaName(e.target.value)} 
                        placeholder="Enter formula name"
                        style={{ width: '250px', padding: '5px' }}
                    />
                </label>
            </div>
    
            {/* Dosage Instructions Input */}
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <label>
                    Dosage Instructions:&nbsp;
                    <input 
                        type="text" 
                        value={dosage} 
                        onChange={(e) => setDosage(e.target.value)} 
                        placeholder="e.g., 3 scoops twice a day"
                        style={{ width: '250px', padding: '5px' }}
                    />
                </label>
            </div>
    
            {/* Ingredient Table */}
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
                            overrideMarkup={row.overrideMarkup}
                            markup={row.markup}
                            onMarkupChange={updateRowData}
                            onEditIngredient={onEditIngredient}
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
            </table>
    
            {/* Copy Formula Button */}
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button onClick={copyFormulaToClipboard} style={{ padding: '10px 15px', fontSize: '16px' }}>
                    Copy Formula
                </button>
            </div>
    
            {/* Ingredient Popup for Adding/Editing */}
            {isPopupOpen && (
                <IngredientPopup 
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onSave={handleIngredientSave}
                    ingredient={currentIngredient}
                />
            )}
        </div>
    );
    
};

export default IngredientRows;
