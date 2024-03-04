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
        onSave({
            name: name,
            costPerGram: parseFloat(costPerGram) // Ensure costPerGram is a number
        });
        onClose(); // Close the popup
    };
        
    if (!isOpen) return null;

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>{ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}</h2>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Ingredient Name"
                />
                <input 
                    type="number" 
                    value={costPerGram} 
                    onChange={(e) => setCostPerGram(e.target.value)} 
                    placeholder="Cost per Gram"
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default IngredientPopup;
