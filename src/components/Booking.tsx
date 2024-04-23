import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
 

interface Booking {
    date: string;
    treatment: string;
    time: string;
    name: string;
    phone: string;
  }

interface Holiday {
  datum: string;
}

function Booking() {

    const [date, setDate] = useState<Date | null> (null);
    const [treatment, setTreatment] = useState('');
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const today = new Date();
    const selectedDate = date ? date.toLocaleDateString().slice(0, 10) : null;
    const isMonday =(checkDate: Date) => {
      return checkDate.getDay()=== 1;
    }


    useEffect(() => {
      fetch('https://sholiday.faboul.se/dagar/v2.1/2024')
      .then(response => response.json())
      .then(data => {
      console.log(data) 
      const holiday = data.dagar.filter((day: any) => day.helgdag);
      console.log(holiday);
      setHolidays(holiday);
});}, []);
    
useEffect(() => {
  fetch('https://188.166.44.168:8080/bookings')
  .then(response => response.json())
  .then(data => setBookings(data));
}, [treatment, time, name, phone, bookings]);

    useEffect(() => {
        setTreatment('');
        setTime('Välj tid');
      }, [date]);  

  const times = ['Välj tid', 'Morgon', 'Eftermiddag', 'Kväll'] .filter(
    time => !bookings.some(
    booking => booking.date === selectedDate && booking.treatment === treatment && booking.time === time)); 

  const handleBooking = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
 
  if(!name || !phone) {
    setMessage('Måste ange både namn och telefonnummer, bokning avbruten!');
    return;
  }
  if (!date || !treatment || treatment === '' || time === 'Välj tid') {
    setMessage('Fyll i datum och spabehandling, bokning avbruten!');
    return;
  }
  if(date <= today) {
    setMessage('Datumet har redan passerat, bokning avbruten!');
    return;
  }
  if(holidays.some(
    holiday => holiday.datum === selectedDate)) {
    setMessage('Datumet är en helgdag dag, bokning avbruten!');
    return;
  }
  if(isMonday(date)) {
    setMessage('På Måndagar är det stängt, bokning avbruten!');
    return;
  }  

  const booking = { date: selectedDate , treatment, time, name, phone };

  fetch('https://188.166.44.168:8080/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking)
  })
  .then(() => {
    setDate(null);
    setTreatment('');
    setTime('Välj tid');
    setName('');
    setPhone('');
    setMessage('Bokning genomförd!');
  })
  .catch((error) => {
    console.error('Error:', error);
    setMessage('Något gick fel, försök igen!');
  });
}
    return (
      <>
      <div id="calendarStyle">
      <Calendar 
        onChange={(value) => {
          if (value instanceof Date) {
            setDate(value);
            setName('');
            setPhone('');
            setMessage('');
          }
        }} 
        value={date} />

      <select onChange={(e) => setTreatment(e.target.value)} value={treatment}>
        <option value="">Välj behandling</option>
        <option value="hot">Varm</option>
        <option value="cold">Kall</option>
      </select>
      <select onChange={(e) => setTime(e.target.value)} value={time}>
        {times.map(time => <option key={time} value={time}>{time.charAt(0).toUpperCase() + time.slice(1)}</option>)}
      </select>
        <input type="text" placeholder="Namn" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Telefonnummer" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button onClick={handleBooking}>Boka</button>
      </div>
      <p>{date ? `Valt datum: ${date.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}` : ''} {message} </p>
      <p>Obs du måste boka med en dags varsel så vi kan förbereda din behandling! <br />
      Tack vare VG krav så har vi stängt Måndagar och helgdagar, tack för visad förståelse! </p>   
      </>
      );
  }
  
export default Booking