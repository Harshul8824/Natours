import { useEffect, useState } from "react";

function App() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/tours")
      .then(res => res.json())
      .then(data => setTours(data.data.doc));
  }, []);


  return (
    <div>
      <h1>Natours Tours</h1>
      {tours.map(tour => (
        <div key={tour._id}>
          <h3>{tour.name}</h3>
          <p>₹{tour.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
