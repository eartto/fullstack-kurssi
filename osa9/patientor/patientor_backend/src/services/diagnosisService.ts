import diagnosisData from '../data/diagnoses';

import { Diagnosis } from '../types/types';

const diagnoses: Diagnosis[] = diagnosisData as Diagnosis[];

const getEntries = (): Diagnosis[] => {
    return diagnoses;
}

const addDiagnosis = () => {
    return null;
}

export default { getEntries, addDiagnosis };