import { NewPatient, Gender, NewEntry, Discharge, HealthCheckRating, SickLeave } from './types/types'

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name');
    }

    return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
    if (!dateOfBirth || !isString(dateOfBirth)) {
        throw new Error('Incorrect or missing dateOfBirth');
    }

    return dateOfBirth;
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender ' + gender)
    }
    return gender
};

const parseOccupation = (occupation: unknown): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation');
    }

    return occupation;
};

const parseDescription = (description: unknown): string => {
    if (!description || !isString(description)) {
        throw new Error('Incorrect or missing description');
    }

    return description;
};

const parseDate = (date: unknown): string => {
    if (!date || !isString(date)) {
        throw new Error('Incorrect or missing date');
    }

    return date;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect or missing specialist');
    }

    return specialist;
};

const isDischarge = (param: unknown): param is Discharge => {
    return ((param as Discharge).criteria !== undefined || (param as Discharge).date !== undefined);
};

const parseDischarge = (discharge: unknown): Discharge => {
    if (!discharge || !isDischarge(discharge)) {
        throw new Error('Incorrect or missing discharge');
    }

    return discharge;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).map(v => v).includes(param);
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!healthCheckRating || !isHealthCheckRating(Number(healthCheckRating))) {
        throw new Error('Incorrect or missing healthCheckRating ');
    }
    return Number(healthCheckRating);
};

const parseEmployerName = (employerName: unknown): string => {
    if (!employerName || !isString(employerName)) {
        throw new Error('Incorrect or missing employerName');
    }

    return employerName;
};

const toNewPatient = (object: unknown): NewPatient => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object) {
        const patient: NewPatient = {
            name: parseName(object.name),
            dateOfBirth: parseDateOfBirth(object.dateOfBirth),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation)
        };

        return patient;
    }
    throw new Error('Incorrect data: a field missing');
};

const isSickLeave = (param: unknown): param is SickLeave => {
    return ((param as SickLeave).startDate !== undefined || (param as SickLeave).endDate !== undefined);
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
    if (!sickLeave || !isSickLeave(sickLeave)) {
        throw new Error('Incorrect or missing sickleave');
    }

    return sickLeave;
};

export const toNewEntry = (object: unknown): NewEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('type' in object) {
        if (object.type === "Hospital") {
            if ('description' in object && 'date' in object && 'specialist' in object && 'discharge' in object) {
                const newEntry: NewEntry = {
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    type: "Hospital",
                    discharge: parseDischarge(object.discharge)
                };
                return newEntry
            }
        }
        if (object.type === "HealthCheck") {
            if ('description' in object && 'date' in object && 'specialist' in object && 'healthCheckRating' in object) {
                const newEntry: NewEntry = {
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    type: "HealthCheck",
                    healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
                };
                return newEntry
            }
        }
        if (object.type === "OccupationalHealthcare") {
            if ('description' in object && 'date' in object && 'specialist' in object && 'employerName' in object && 'sickLeave' in object) {
                const newEntry: NewEntry = {
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    type: "OccupationalHealthcare",
                    employerName: parseEmployerName(object.employerName),
                    sickLeave: parseSickLeave(object.sickLeave)
                };
                return newEntry
            }
        }
    }
    throw new Error('Incorrect data: a field missing');
}

export default toNewPatient;