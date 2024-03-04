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
    const [totalMass, setTotalMass] = useState(126); // Default total mass

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
            <table style={{ width: '100%', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Condition(s)</th>
                        <th>Formula</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <PatientSelect onPatientSelect={handlePatientSelect} />
                        </td>
                        <td>
                            <ConditionSelect style={{ textAlign: 'center' }}
                                selectedPatientId={selectedPatientId}
                                onConditionSelect={handleConditionSelect} 
                            />
                        </td>
                        <td>
                            <FormulaDisplay selectedFormulaId={selectedFormulaId} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="row">
                <GlobalFormulaInfo totalMass={totalMass} setTotalMass={setTotalMass} />
            </div>
            <h3 style={{ textAlign: 'center' }}>Formula</h3>
            <IngredientRows selectedFormulaId={selectedFormulaId} totalMass={totalMass} />
            <ActionButtons 
                onClear={handleClear} 
                onCancel={handleCancel} 
                onSave={handleSave} 
            />
        </div>
    );
};

export default App;
