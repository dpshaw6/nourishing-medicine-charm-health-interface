import React, { useState, useEffect } from 'react';
import ConditionPopup from './ConditionPopup'; // Import ConditionPopup component
import mockPatients from '../data/patients.json';

const ConditionSelect = ({ selectedPatientId, onConditionsUpdate }) => {
    const [conditions, setConditions] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [currentCondition, setCurrentCondition] = useState(null);
    const [isConditionPopupOpen, setIsConditionPopupOpen] = useState(false);

    useEffect(() => {
        // Fetch conditions from the backend
        fetch('http://localhost:3001/api/conditions')
            .then(response => response.json())
            .then(data => setConditions(data))
            .catch(error => console.error('Error fetching conditions:', error));

        if (selectedPatientId) {
            const patient = mockPatients.find(p => p.id === selectedPatientId);
            const patientConditionIds = patient ? patient.conditionIds : [];
            const initialSelectedConditions = patientConditionIds.map(id => ({ id }));
            setSelectedConditions(initialSelectedConditions);
        } else {
            setSelectedConditions([]);
        }
    }, [selectedPatientId]);

    const handleAddCondition = () => {
        setSelectedConditions([...selectedConditions, { id: '' }]);
        setCurrentCondition(null); // Reset current condition for adding a new one
        setIsConditionPopupOpen(true); // Open the popup
    };

    const handleEditCondition = (index) => {
        const conditionId = selectedConditions[index].id;
        const conditionToEdit = conditions.find(cond => cond._id === conditionId);
        setCurrentCondition(conditionToEdit || null); // Set the current condition to edit
        setIsConditionPopupOpen(true); // Open the popup
    };

    const handleConditionChange = (index, newConditionId) => {
        const updatedConditions = selectedConditions.map((condition, idx) =>
            idx === index ? { ...condition, id: newConditionId } : condition
        );
        setSelectedConditions(updatedConditions);
        if (onConditionsUpdate) {
            onConditionsUpdate(updatedConditions);
        }
    };
    
    const handleConditionSave = async (conditionData) => {
        if (currentCondition && currentCondition._id) {
            // Update existing condition
            const response = await fetch(`http://localhost:3001/api/conditions/${currentCondition._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conditionData),
            });
    
            if (response.ok) {
                // Update the conditions list with the edited condition
                const updatedConditions = conditions.map(cond => 
                    cond._id === currentCondition._id ? { ...cond, ...conditionData } : cond
                );
                setConditions(updatedConditions);
    
                // Update the selected condition in the list
                const updatedSelectedConditions = selectedConditions.map(cond => 
                    cond.id === currentCondition._id ? { id: currentCondition._id } : cond
                );
                setSelectedConditions(updatedSelectedConditions);
            } else {
                console.error('Failed to update condition');
            }
        } else {
            // Add new condition
            const response = await fetch('http://localhost:3001/api/conditions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conditionData),
            });
    
            if (response.ok) {
                const newCondition = await response.json();
                setConditions([...conditions, newCondition]);
    
                // Automatically select the new condition
                setSelectedConditions([...selectedConditions, { id: newCondition._id }]);
            } else {
                console.error('Failed to add condition');
            }
        }
    
        // Close the popup
        setIsConditionPopupOpen(false);
        // Refresh conditions list logic here
        fetchConditions();
    };
        
    // Function to fetch conditions
    const fetchConditions = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/conditions');
            const data = await response.json();
            setConditions(data);
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    };

    const handleAddConditionLine = () => {
        setSelectedConditions([...selectedConditions, { id: '' }]);
    };

    const openPopupToAddEditCondition = (index) => {
        const conditionId = selectedConditions[index]?.id;
        const conditionToEdit = conditions.find(cond => cond._id === conditionId);
        setCurrentCondition(conditionToEdit || null);
        setIsConditionPopupOpen(true);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <table style={{ margin: '0 auto' }}>
                <tbody>
                    {selectedConditions.map((condition, index) => (
                        <tr key={index}>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <select 
                                        value={condition.id} 
                                        onChange={(e) => handleConditionChange(index, e.target.value)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        <option value="">Select a Condition</option>
                                        {conditions.map(cond => (
                                            <option key={cond._id} value={cond._id}>{cond.name}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => openPopupToAddEditCondition(index)}>
                                        {condition.id ? 'Edit' : 'Add'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddConditionLine}>Add Condition</button>

            {isConditionPopupOpen && (
                <ConditionPopup 
                    isOpen={isConditionPopupOpen} 
                    onClose={() => setIsConditionPopupOpen(false)} 
                    onSave={handleConditionSave} 
                    condition={currentCondition}
                />
            )}
        </div>
    );
};

export default ConditionSelect;