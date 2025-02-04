interface InputValuesExercise {
    target: number;
    days: number[];
}

interface result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

const parseArgumentsExcercise = (args: string[]): InputValuesExercise => {
    if (args.length < 4) throw new Error('Not enough arguments');

    for (let i = 2; i < process.argv.length; ++i) {

        if (isNaN(Number(args[i]))) {
            throw new Error('Provided values were not numbers!');
        }
    }
    const target: number = Number(process.argv[2]);

    const trainingDays: number[] = [];

    for (let i = 3; i < process.argv.length; ++i) {

        trainingDays.push(Number(process.argv[i]))
            ;
    }

    return {
        target: target,
        days: trainingDays
    };


};

const calculateExercises = (target: number, days: number[]): result => {
    const trainingDays = days.filter(d => d !== 0).length;
    const average = days.reduce((sum, currentValue) => sum + currentValue) / days.length;
    let success = false;
    if (average >= target) {
        success = true;
    }
    const rating = () => {
        if (average < 1.5) {
            return 1;
        }
        if (average < 2) {
            return 2;
        }
        if (average > 2) {
            return 3;
        }
        else {
            return 0;
        }
    };

    const ratingDescription = () => {
        if (rating() === 1) {
            return 'try harder next time and apply yourself';
        }
        if (rating() === 2) {
            return 'not too shabby, but you can do better';
        }
        if (rating() === 3) {
            return "you've outdone yourself. Nice job, son!";
        }
        else {
            return 'how did you get here?';
        }
    };
    const result = {
        periodLength: days.length,
        trainingDays: trainingDays,
        average: average,
        target: target,
        success: success,
        rating: rating(),
        ratingDescription: ratingDescription(),
    };
    return result;
};



try {
    const { target, days } = parseArgumentsExcercise(process.argv);
    console.log(calculateExercises(target, days));

} catch (error: unknown) {
    let errorMessage = 'something went wrong';
    if (error instanceof Error) {
        errorMessage += 'Error: ' + error.message;
    }
    console.log(errorMessage);
}

export default calculateExercises;
