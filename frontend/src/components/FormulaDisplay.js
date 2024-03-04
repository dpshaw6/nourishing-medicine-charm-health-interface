import React from 'react';
import mockFormulas from '../data/formulas.json';

const FormulaDisplay = ({ selectedFormulaId }) => {
    const formula = mockFormulas.find(f => f.id === selectedFormulaId);

    return (
        <div>
            <span>{formula ? formula.name : 'No formula selected'}</span>
        </div>
    );
};

export default FormulaDisplay;
