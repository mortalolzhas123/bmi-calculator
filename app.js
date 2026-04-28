const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000; // Requirement: Listen on port 3000

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve CSS from public folder

// GET / : Render the input form
// Requirement: Render a simple HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// POST /calculate-bmi : Handle the calculation
// Requirement: Accept weight and height and calculate BMI
app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    // Requirement: Check if weight and height are positive numbers
    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.send("<h1>Invalid Input</h1><p>Please enter positive numbers.</p><a href='/'>Try again</a>");
    }

    // Formula: BMI = weight (kg) / height^2 (m)
    // Assuming input is in cm, converting to meters
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    // Requirement: Determine category based on BMI value
    let category = "";
    let resultColor = "";

    if (bmi < 18.5) {
        category = "Underweight";
        resultColor = "blue";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Normal weight";
        resultColor = "green"; // Requirement: Green for Normal
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = "Overweight";
        resultColor = "orange"; // Requirement: Yellow/Orange for Overweight
    } else {
        category = "Obese";
        resultColor = "red"; // Requirement: Red for Obese
    }

    // Return the response to the user
    res.send(`
        <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
            <h1>BMI Results</h1>
            <p style="font-size: 24px;">Your BMI is: <strong>${bmi}</strong></p>
            <p style="font-size: 20px; color: ${resultColor};">Category: <strong>${category}</strong></p>
            <a href="/">Calculate Again</a>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});