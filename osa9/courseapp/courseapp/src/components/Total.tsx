interface TotalExercisesProps {
    totalExercises: number;
}

const Total = (props: TotalExercisesProps) => {
    return (
        <p>
        Number of exercises {props.totalExercises}
      </p>
    )
};

export default Total