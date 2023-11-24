import React, { useState } from 'react';
import PatientSelect from './components/PatientSelect';
import ConditionSelect from './components/ConditionSelect';
import FormulaDisplay from './components/FormulaDisplay';
import GlobalFormulaInfo from './components/GlobalFormulaInfo';
import IngredientRows from './components/IngredientRows';
import ActionButtons from './components/ActionButtons';
import mockPatients from './data/patients.json';

const App = () => {
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [selectedConditionId, setSelectedConditionId] = useState('');
    const [selectedFormulaId, setSelectedFormulaId] = useState('');

    const handlePatientSelect = patientId => {
        setSelectedPatientId(patientId);
        const patient = mockPatients.find(p => p.id === patientId);
        setSelectedFormulaId(patient?.formulaIds[0] || ''); // Assumes first formula if any
    };

    const handleConditionSelect = conditionId => {
        setSelectedConditionId(conditionId);
    };

    const handleClear = () => {
        // Clear logic
    };

    const handleCancel = () => {
        // Cancel logic
    };

    const handleSave = () => {
        // Save logic
    };

    return (
        <div>
            <PatientSelect onPatientSelect={handlePatientSelect} />
            <ConditionSelect 
                selectedPatient={selectedPatientId}
                onConditionSelect={handleConditionSelect} 
            />
            <FormulaDisplay selectedFormulaId={selectedFormulaId} />
            <GlobalFormulaInfo />
            <IngredientRows />
            <ActionButtons 
                onClear={handleClear} 
                onCancel={handleCancel} 
                onSave={handleSave} 
            />
        </div>
    );
};

export default App;
