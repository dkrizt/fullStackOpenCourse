
const Total = ({course}) => {
      const exerciseArr = course.parts.map((item) => item.exercises);
  const initialValue = 0;
  const sumWithInitial = exerciseArr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );


  return (
    <div>
      <h3>Total number of {sumWithInitial} courses</h3>
    </div>
  )
}

export default Total
