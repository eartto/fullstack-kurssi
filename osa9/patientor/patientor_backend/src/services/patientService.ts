import { v1 as uuid } from 'uuid'

import patientData from '../data/patients';

import { Patient, NewPatient, NonSensitivePatientEntry, Entry, NewEntry } from '../types/types';

const patients: Patient[] = patientData as Patient[];

const getEntries = (): Omit<Patient, 'ssn'>[] => {
    return patients;
}

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
    }))
}

const getNonSensitiveEntry = (id: string): NonSensitivePatientEntry | undefined => {
    return patients.find(p => p.id === id)

}

const addPatient = (patient: NewPatient): Patient => {
   const newPatient = {
    id: uuid(),
    ...patient
   };

   patients.push(newPatient);
   return newPatient;
}

const addEntry = (id: string, entry: NewEntry): Entry => {
    const newEntry = {
        id: uuid(),
        ...entry
    };
    const patient = patients.find(p => p.id === id);
    patient?.entries?.push(newEntry);

    return newEntry
}

export default { getEntries, getNonSensitiveEntries, getNonSensitiveEntry, addPatient, addEntry };