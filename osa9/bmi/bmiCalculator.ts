interface InputValuesBMI {
    height: number;
    weight: number;
}

const parseArguments = (args: string[]): InputValuesBMI => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            height: Number(args[2]),
            weight: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

const calculateBmi = (height: number, weight: number) => {
    const result = (weight / height / height) * 10000;
    if (result < 16.0) {
        return 'Underweight (Severe thinness)';
    }
    if (result <= 16.9) {
        return 'Underweight (Moderate thinness)	';
    }
    if (result <= 18.4) {
        return 'Underweight (Mild thinness)';
    }
    if (result >= 18.5 && result <= 24.9) {
        return 'Normal (healthy weight)';
    }
    if (result >= 25.0 && result <= 29.9) {
        return 'Overweight (Pre-obese)';
    }
    if (result >= 30.0 && result <= 34.9) {
        return 'Obese (Class I)';
    }
    if (result >= 35.0 && result <= 39.9) {
        return 'Obese (Class II)';
    }
    if (result >= 40) {
        return 'Obese (Class III)';
    }
    else {
        return 'error';
    }
};
try {
    const { height, weight } = parseArguments(process.argv);

    console.log(calculateBmi(height, weight));
} catch (error: unknown) {
    let errorMessage = 'something went wrong';
    if (error instanceof Error) {
        errorMessage += 'Error: ' + error.message;
    }
    console.log(errorMessage);
}

export default  calculateBmi;
