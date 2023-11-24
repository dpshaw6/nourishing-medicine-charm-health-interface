import React, { useState, useEffect } from 'react'; // Import useEffect here

const GlobalFormulaInfo = () => {
    const [massPerDay, setMassPerDay] = useState(9); // Default 9g
    const [numDays, setNumDays] = useState(14);     // Default 14 days
    const [totalMass, setTotalMass] = useState(126); // Default 126g

    // Update total mass when massPerDay or numDays changes
    useEffect(() => {
        setTotalMass(massPerDay * numDays);
    }, [massPerDay, numDays]);

    return (
        <div>
            <div>
                <label>Mass/Day (g): </label>
                <input 
                    type="number" 
                    value={massPerDay} 
                    onChange={e => setMassPerDay(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Number of Days: </label>
                <input 
                    type="number" 
                    value={numDays} 
                    onChange={e => setNumDays(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Total Mass (g): </label>
                <input 
                    type="number" 
                    value={totalMass} 
                    readOnly
                />
            </div>
        </div>
    );
};

export default GlobalFormulaInfo;
