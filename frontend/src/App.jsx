import { useEffect, useState } from "react";

function App() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/tours")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA 👉", data); // browser console
        setTours(data.data.data);         // ✅ set state
      })
      .catch(err => console.error(err));
  }, []); 

  console.log(tours);

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
