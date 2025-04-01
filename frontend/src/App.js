import React, { useState } from 'react';
import FormulaDisplay from './components/FormulaDisplay';
import GlobalFormulaInfo from './components/GlobalFormulaInfo';
import IngredientRows from './components/IngredientRows';
import ActionButtons from './components/ActionButtons';
import './App.css';

const App = () => {
    const [patientName, setPatientName] = useState(''); // Text field for patient name
    const [conditionName, setConditionName] = useState(''); // Text field for condition name
    const [selectedFormulaId, setSelectedFormulaId] = useState('');
    const [totalMass, setTotalMass] = useState(126); // Default total mass
    const [numDays, setNumDays] = useState(14);

    return (
        <div className="app-container">
            <table style={{ width: '100%', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Condition</th>
                        <th>Formula</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Enter patient name"
                                style={{ width: '200px', padding: '5px' }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={conditionName}
                                onChange={(e) => setConditionName(e.target.value)}
                                placeholder="Enter condition"
                                style={{ width: '200px', padding: '5px' }}
                            />
                        </td>
                        <td>
                            <FormulaDisplay selectedFormulaId={selectedFormulaId} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="row">
            <GlobalFormulaInfo 
                totalMass={totalMass} 
                setTotalMass={setTotalMass}
                numDays={numDays}
                setNumDays={setNumDays}
                />
            </div>
            <h3 style={{ textAlign: 'center' }}>Formula</h3>
            <IngredientRows 
                selectedFormulaId={selectedFormulaId} 
                totalMass={totalMass} 
                patientName={patientName} 
                conditionName={conditionName} 
                numDays={numDays}
            />
            <ActionButtons />
        </div>
    );
};

export default App;
