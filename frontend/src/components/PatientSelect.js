import React, { useState, useEffect } from 'react';
import mockPatients from '../data/patients.json';

const PatientSelect = ({ onPatientSelect }) => {
    const [selectedPatient, setSelectedPatient] = useState('');

    useEffect(() => {
        if (selectedPatient) {
            onPatientSelect(selectedPatient);
        }
    }, [selectedPatient, onPatientSelect]);

    return (
        <div>
            <label>Patient: </label>
            <select
                value={selectedPatient}
                onChange={e => setSelectedPatient(e.target.value)}
            >
                <option value="">Select a Patient</option>
                {mockPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
            </select>
        </div>
    );
};

export default PatientSelect;
