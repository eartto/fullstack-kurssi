import React from "react";

interface CourseNameProps {
    courseName: string;
}

const Header = (props: CourseNameProps) => {
    return <h1>{props.courseName}</h1>
};

export default Header