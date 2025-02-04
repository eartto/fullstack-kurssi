import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from '../utils';
import { toNewEntry } from '../utils';

const router = express.Router()

router.get('/', (_req, res) => {
    res.send(patientService.getNonSensitiveEntries())
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    res.send(patientService.getNonSensitiveEntry(id))
})

router.post('/', (req, res) => {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient)
});

router.post('/:id/entries', (req, res) => {
    try {
        const id = req.params.id;
        const newEntry = toNewEntry(req.body)
        const addedEntry = patientService.addEntry(id, newEntry);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
})

export default router;