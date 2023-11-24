import React from 'react';

const ActionButtons = ({ onClear, onCancel, onSave }) => {
    return (
        <div>
            <button onClick={onClear}>Clear</button>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onSave}>Save</button>
        </div>
    );
};

export default ActionButtons;
