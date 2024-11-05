let previousValues = {
    material: null,
    effectiveLoad: null,
    bendingMoment: null,
    bendingStress: null,
    sectionModulus: null,
    deflection: null,
};

// Load the bending moment and deflection calculation form
function loadCalculationForm(type) {
    if (type === 'bendingMoment') {
        document.getElementById("formContainer").innerHTML = `
            <h2>Bending Moment Calculation</h2>
            <label for="loadType">Load Type:</label>
            <select id="loadType" onchange="updateLoadInputs()">
                <option value="point">Point Load</option>
                <option value="uniform">Uniformly Distributed Load</option>
            </select>
            <div id="loadInputs">
                <label for="load">Load (kg): </label>
                <input type="number" id="load" required>
                <label for="beamLength">Beam Length (mm): </label>
                <input type="number" id="beamLength" value="800" required>
                <label for="factorOfSafety">Factor of Safety (FoS): </label>
                <input type="number" id="factorOfSafety" value="1.5" step="0.1" required>
            </div>
            <button onclick="calculateBendingMoment()">Calculate Bending Moment</button>
            <h3>Material Selection</h3>
            <select id="materialSelection" onchange="updateMaterialProperties()">
                <option value="">Select Material</option>
                <option value="A36">ASTM A36</option>
                <option value="A992">ASTM A992</option>
                <option value="S235">S235</option>
                <option value="S355">S355</option>
                <option value="304">Stainless Steel 304</option>
                <option value="6061">Aluminum 6061</option>
                <option value="A572">ASTM A572</option>
            </select>
            <div id="materialProperties"></div>
            <h3>Deflection Calculation</h3>
            <label for="modulusOfElasticity">Modulus of Elasticity (E, N/mm²): </label>
            <input type="number" id="modulusOfElasticity" required>
            <label for="momentOfInertia">Moment of Inertia (I, mm⁴): </label>
            <input type="number" id="momentOfInertia" required>
        `;
    }
}

function calculateBendingMoment() {
    const load = parseFloat(document.getElementById("load").value);
    const length = parseFloat(document.getElementById("beamLength").value);
    const factorOfSafety = parseFloat(document.getElementById("factorOfSafety").value);
    previousValues.effectiveLoad = load * factorOfSafety;
    const loadInNewtons = previousValues.effectiveLoad * 9.81;
    const loadType = document.getElementById("loadType").value;

    if (loadType === "point") {
        previousValues.bendingMoment = loadInNewtons * (length / 4);
    } else if (loadType === "uniform") {
        previousValues.bendingMoment = (loadInNewtons * Math.pow(length, 2)) / 8;
    }

    displayResults();
}

function updateMaterialProperties() {
    const material = document.getElementById("materialSelection").value;
    previousValues.material = material;

    if (material === "A36") {
        previousValues.yieldStrength = 250;
    } else if (material === "A992") {
        previousValues.yieldStrength = 345;
    } else if (material === "S235") {
        previousValues.yieldStrength = 235;
    } else if (material === "S355") {
        previousValues.yieldStrength = 355;
    } else if (material === "304") {
        previousValues.yieldStrength = 215;
    } else if (material === "6061") {
        previousValues.yieldStrength = 240;
    } else if (material === "A572") {
        previousValues.yieldStrength = 345;
    }

    displayResults();
}

function calculateBendingStress() {
    return previousValues.yieldStrength / parseFloat(document.getElementById("factorOfSafety").value);
}

function calculateSectionModulus() {
    return previousValues.bendingMoment / previousValues.bendingStress;
}

function calculateDeflection() {
    const load = previousValues.effectiveLoad * 9.81;
    const beamLength = parseFloat(document.getElementById("beamLength").value);
    const E = parseFloat(document.getElementById("modulusOfElasticity").value);
    const I = parseFloat(document.getElementById("momentOfInertia").value);

    let deflection;
    const loadType = document.getElementById("loadType").value;

    if (loadType === "point") {
        deflection = (load * Math.pow(beamLength, 3)) / (48 * E * I);
    } else if (loadType === "uniform") {
        deflection = (5 * load * Math.pow(beamLength, 4)) / (384 * E * I);
    }

    return deflection;
}

function displayResults() {
    const bendingMoment = previousValues.bendingMoment;
    const effectiveLoad = previousValues.effectiveLoad * 9.81;
    const material = previousValues.material;

    let resultHtml = `
        <h2>Bending Moment Calculation</h2>
        <p>Effective Load: ${previousValues.effectiveLoad.toFixed(2)} kg</p>
        <p>Load in Newtons (F): ${effectiveLoad.toFixed(2)} N</p>
        <p>Maximum Bending Moment: ${bendingMoment.toFixed(2)} N·mm</p>
    `;

    if (material) {
        previousValues.bendingStress = calculateBendingStress();
        resultHtml += `
            <h2>Bending Stress Calculation</h2>
            <p>Bending Stress (σ<sub>max</sub>): ${previousValues.bendingStress.toFixed(2)} N/mm²</p>
        `;
    }

    previousValues.sectionModulus = calculateSectionModulus();
    resultHtml += `
        <h2>Section Modulus Calculation</h2>
        <p>Section Modulus (Z): ${previousValues.sectionModulus.toFixed(2)} mm³</p>
    `;

    previousValues.deflection = calculateDeflection();
    resultHtml += `
        <h2>Deflection Calculation</h2>
        <p>Maximum Deflection (δ<sub>max</sub>): ${previousValues.deflection.toFixed(3)} mm</p>
    `;

    document.getElementById("result").innerHTML = resultHtml;
}

function resetCalculator() {
    previousValues = {
        material: null,
        effectiveLoad: null,
        bendingMoment: null,
        bendingStress: null,
        sectionModulus: null,
        deflection: null,
    };
    document.getElementById("formContainer").innerHTML = '';
    document.getElementById("result").innerHTML = '';
}
