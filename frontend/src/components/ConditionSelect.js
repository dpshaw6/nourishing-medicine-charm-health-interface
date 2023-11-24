import React, { useState, useEffect } from 'react';
import mockConditions from '../data/conditions.json';
import mockPatients from '../data/patients.json';

const ConditionSelect = ({ selectedPatientId, onConditionSelect }) => {
    const [availableConditions, setAvailableConditions] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState('');

    useEffect(() => {
        if (selectedPatientId) {
            const patient = mockPatients.find(p => p.id === selectedPatientId);
            const patientConditionIds = patient ? patient.conditionIds : [];
            const conditions = mockConditions.filter(cond => patientConditionIds.includes(cond.id));
            setAvailableConditions(conditions);

            // Automatically select the first condition for the new patient
            if (patientConditionIds.length > 0) {
                const firstConditionId = patientConditionIds[0];
                setSelectedCondition(firstConditionId);
                if (onConditionSelect) {
                    onConditionSelect(firstConditionId);
                }
            } else {
                setSelectedCondition('');
            }
        } else {
            setAvailableConditions([]);
            setSelectedCondition('');
        }
    }, [selectedPatientId, onConditionSelect]);

    const handleConditionChange = (e) => {
        setSelectedCondition(e.target.value);
        if (onConditionSelect) {
            onConditionSelect(e.target.value);
        }
    };

    return (
        <div>
            <label>Condition: </label>
            <select
                value={selectedCondition}
                onChange={handleConditionChange}
                disabled={!availableConditions.length}
            >
                <option value="">Select a Condition</option>
                {availableConditions.map(condition => (
                    <option key={condition.id} value={condition.id}>{condition.name}</option>
                ))}
            </select>
        </div>
    );
};

export default ConditionSelect;
