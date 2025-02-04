import React from 'react'

import Part from "./Part";
import { CoursePart } from "../App";

interface CoursePartsProps {
    courseParts: Array<CoursePart>
}

const Content = (props: CoursePartsProps) => {
    return (
        <div>
            {props.courseParts.map(p => <Part part={p} key={p.name}/> )}
        </div>
    )
};

export default Content