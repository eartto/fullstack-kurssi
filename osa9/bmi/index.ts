import express from 'express';

import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';


const app = express();

app.use(express.json());


app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    if (!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
        const result = calculateBmi(Number(req.query.height), Number(req.query.weight));
        res.send(result);
    } else {
        res.status(400).send({ error: 'malformatted parameters' });
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const inputObject: any = req.body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    if (inputObject.target === undefined || inputObject.daily_exercises === undefined) {
        res.status(400).send({ error: 'parameters missing' });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    else if (isNaN(Number(inputObject.target)) || inputObject.daily_exercises.some(isNaN)) {
        res.status(400).send({ error: 'malformatted parameters' });
    }
    else {

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const result = calculateExercises(inputObject.target, inputObject.daily_exercises);
        res.send(result);
    }


});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});