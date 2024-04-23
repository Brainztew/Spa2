interface Props {
    setPage: (page: string) => void
}

function Meny(props: Props) {
  return (
    <div>
      <button className="myButton" onClick={() => props.setPage("start")}>Hem</button>
      <button className="myButton" onClick={() => props.setPage("about")}>Om behandlingarna</button>
      <button className="myButton" onClick={() => props.setPage("booking")}>Boka tider</button>
      <button className="myButton" onClick={() => props.setPage("booked")}>Bokade tider</button>
    </div>
  )
}

export default Meny