import React, { useState, useEffect } from 'react';
import "../styles/PopupStyles.css";

const IngredientPopup = ({ isOpen, onClose, onSave, ingredient }) => {
    const [name, setName] = useState('');
    const [costPerGram, setCostPerGram] = useState('');

    useEffect(() => {
        if (ingredient) {
            setName(ingredient.name);
            setCostPerGram(ingredient.costPerGram);
        }
    }, [ingredient]);

    const handleSave = () => {
        onSave({ name, costPerGram });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>{ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}</h2>
                <tr>
                    <td>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Ingredient Name"
                        />
                    </td>
                    <td>
                        <input 
                            type="number" 
                            value={costPerGram} 
                            onChange={(e) => setCostPerGram(e.target.value)} 
                            placeholder="Cost per Gram"
                        />
                    </td>
                    <td>
                        <button onClick={handleSave}>Save</button>
                    </td>
                    <td>
                        <button onClick={onClose}>Cancel</button>
                    </td>
                </tr>
            </div>
        </div>
    );
};

export default IngredientPopup;
