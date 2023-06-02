const SubCourse = ({ courses }) => {
    return (
        <div>
            {courses.map(course => {
               return (
                <div key={course.id}>
                    <h2>{course.name}</h2>
                    {course.parts.map(part =>
                        <p key={part.id}>
                            {part.name} {part.exercises}
                        </p>    
                    )}
                    <p><b>
                        total of {course.parts.reduce(
                        (sum, part) => sum + part.exercises, 0)} exercise(s)
                    </b></p>
                </div>
               )
            })}
        </div>
    )
}

const Course = ({ courses }) => {
    return (
        <div>
            <h1>Web development curriculum</h1>
            <SubCourse courses={courses} />
        </div>
    )
}

export default Course