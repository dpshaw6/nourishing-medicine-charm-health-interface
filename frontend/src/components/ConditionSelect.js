import React, { useState, useEffect } from 'react';
import mockConditions from '../data/conditions.json';

const ConditionSelect = ({ selectedPatient, onConditionSelect }) => {
    const [selectedCondition, setSelectedCondition] = useState('');

    useEffect(() => {
        // Reset condition when the patient changes
        setSelectedCondition('');
    }, [selectedPatient]);

    useEffect(() => {
        if (selectedCondition) {
            onConditionSelect(selectedCondition);
        }
    }, [selectedCondition, onConditionSelect]);

    return (
        <div>
            <label>Condition: </label>
            <select
                value={selectedCondition}
                onChange={e => setSelectedCondition(e.target.value)}
                disabled={!selectedPatient}
            >
                <option value="">Select a Condition</option>
                {mockConditions.map(condition => (
                    <option key={condition.id} value={condition.id}>{condition.name}</option>
                ))}
            </select>
        </div>
    );
};

export default ConditionSelect;
