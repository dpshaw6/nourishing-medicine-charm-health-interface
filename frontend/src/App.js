import React, { useState } from 'react';
import PatientSelect from './components/PatientSelect';
import ConditionSelect from './components/ConditionSelect';
import FormulaDisplay from './components/FormulaDisplay';
import GlobalFormulaInfo from './components/GlobalFormulaInfo';
import IngredientRows from './components/IngredientRows';
import ActionButtons from './components/ActionButtons';
import mockPatients from './data/patients.json';
import './App.css';

const App = () => {
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [selectedConditionId, setSelectedConditionId] = useState('');
    const [selectedFormulaId, setSelectedFormulaId] = useState('');

    const handlePatientSelect = patientId => {
        setSelectedPatientId(patientId);
        const patient = mockPatients.find(p => p.id === patientId);

        // Update both formula and condition based on the selected patient
        const firstFormulaId = patient?.formulaIds.length > 0 ? patient.formulaIds[0] : '';
        const firstConditionId = patient?.conditionIds.length > 0 ? patient.conditionIds[0] : '';

        setSelectedFormulaId(firstFormulaId);
        setSelectedConditionId(firstConditionId);
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
        <div className="app-container">
            <div className="row">
                <PatientSelect onPatientSelect={handlePatientSelect} />
                <ConditionSelect 
                    selectedPatientId={selectedPatientId} // Corrected prop name
                    onConditionSelect={handleConditionSelect} 
                />
                <FormulaDisplay selectedFormulaId={selectedFormulaId} />
            </div>
            <div className="row">
                <GlobalFormulaInfo />
            </div>
            <h3 style={{ textAlign: 'center' }}>Formula</h3>
            <IngredientRows selectedFormulaId={selectedFormulaId} />
            <ActionButtons 
                onClear={handleClear} 
                onCancel={handleCancel} 
                onSave={handleSave} 
            />
        </div>
    );
};

export default App;
