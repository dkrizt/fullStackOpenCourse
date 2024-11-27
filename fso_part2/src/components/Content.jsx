import Part from "./Part";

const Content = ({ course }) => {
    
  return (
    <div>
      {course.parts.map((section) => (
        <Part key={section.name} section={section} />
      ))}
    </div>
  );
};

export default Content;
