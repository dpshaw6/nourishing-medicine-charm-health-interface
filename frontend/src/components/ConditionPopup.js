import React, { useState, useEffect } from 'react';
import "../styles/PopupStyles.css";

const ConditionPopup = ({ isOpen, onClose, onSave, condition }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (condition) {
            setName(condition.name);
        } else {
            setName(''); // Reset for adding a new condition
        }
    }, [condition]);

    const handleSave = () => {
        if (condition) {
            // Update existing condition
            onSave({ ...condition, name: name });
        } else {
            // Add new condition
            onSave({ name: name });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>{condition ? 'Edit Condition' : 'Add New Condition'}</h2>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Condition Name"
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default ConditionPopup;
