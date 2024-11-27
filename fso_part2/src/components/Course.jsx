import Content from "./Content";
import Header from "../Header";
import Total from "./Total";

const Course = ({ courses }) => {

  return (
    <div>
      {courses.map((course) => (
        <div key={course.name}>
          <div>
            <Header course={course} />
          </div>
          <div>
            <Content course={course} />
          </div>
          <div>
            <Total course={course} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Course;
