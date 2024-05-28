const Course = ({course}) => {
    const initial = 0
    const sumExercises = course.parts.reduce(
        (counter, current) => counter + current.exercises,
        initial
    )
    return (
            <div>
                <h2>{course.name}</h2>
                <ul>
                    {course.parts.map(course =>
                    <li key={course.id}>
                        {course.name} {course.exercises}
                    </li>
                    )}
                </ul>
                <h4>total of {sumExercises} exercises</h4>
            </div>


    )
}

export default Course