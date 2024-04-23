import { useEffect, useState } from 'react'

interface Booking {
  id: string;
  date: string;
  treatment: string;
  time: string;
  name: string;
  phone: string;
}

function Booked() {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [password, setPassword] = useState('');
  const [areYouAdmin, setAreYouAdmin] = useState(false);

  const adminPassword = 'admin';

  useEffect(() => {
    fetch("http://localhost:8080/bookings")
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a: Booking, b: Booking) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setBookings(sortedData);
      })
  }, [areYouAdmin]);

  const deleteBooking = (id: string) => {
    fetch(`http://localhost:8080/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer admin-token` 
    }})
      .then(() => {
        setBookings(bookings.filter(booking => booking.id !== id));
      })
  }

  return (
    <div>
    {areYouAdmin ? (
      <>
        <h2>Bokningar:</h2>
        {bookings.map((booking: Booking) => (
          <div key={booking.id}>
          <p>
            Namn: {booking.name}&nbsp;&nbsp;
            Behandling: {booking.treatment} &nbsp;&nbsp;
            datum: {new Date(booking.date).toISOString().slice(0, 10)}&nbsp;&nbsp;
            tid: {booking.time}&nbsp;&nbsp;
            <button onClick={() => deleteBooking(booking.id)}>Färdig behandlad</button>
          </p>
          </div>
        ))}
      </>
    ) : (
      <>
        <h2>Admin login, lösenordet är verklingen inte "admin"</h2>
        <input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={() => {
          if(password === adminPassword) {
            setAreYouAdmin(true);
            fetch('http://localhost:8080/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password })
            })
              .then(response => response.json())
              .then(data => {
                console.log(data);
              });
          }
        }}>Logga in</button>
      </>
    )}
    </div>
  )
}

export default Booked