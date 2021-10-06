import React from "react"
import ReactCountdown from "react-countdown"

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => (<>{hours}:{minutes}:{seconds}</>);

const Countdown = ({date}) => <ReactCountdown date={date} renderer={renderer} />

export default Countdown