import React, { useState } from "react";
import { useParams } from "react-router-dom";

function BookService() {
  const { serviceName } = useParams();

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/book-service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service: serviceName,
        location,
        date,
        time,
      }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Book {serviceName}</h2>

      <input
        type="text"
        placeholder="Enter Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}

export default BookService;
