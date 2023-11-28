import React, { useState, useEffect } from 'react';

const GlobalFormulaInfo = ({ totalMass, setTotalMass }) => {
    const [massPerDay, setMassPerDay] = useState(9); // Default 9g
    const [numDays, setNumDays] = useState(14);     // Default 14 days

    // Update total mass when massPerDay or numDays changes
    useEffect(() => {
        setTotalMass(massPerDay * numDays);
    }, [massPerDay, numDays, setTotalMass]);

    return (
        <table style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
            <tbody>
                <tr>
                    <td>
                        <label>Mass/Day (g): </label>
                        <input 
                            type="number" 
                            value={massPerDay} 
                            onChange={e => setMassPerDay(Number(e.target.value))}
                        />
                    </td>
                    <td>
                        <label>Number of Days: </label>
                        <input 
                            type="number" 
                            value={numDays} 
                            onChange={e => setNumDays(Number(e.target.value))}
                        />
                    </td>
                    <td>
                        <label>Total Mass (g): </label>
                        <input 
                            type="number" 
                            value={totalMass}
                            readOnly
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default GlobalFormulaInfo;
