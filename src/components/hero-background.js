import React, {useState} from "react"
import styled from "styled-components"
import BEAST_800_1600 from "../images/beast-800-1600.mp4"
import BEAST_1000_1000 from "../images/beast-1000-1000.mp4"
import BEAST_1920_1080 from "../images/beast-1920-1080.mp4"
import {useWindowResize, useThrottledFn} from "beautiful-react-hooks"

const StyledBackground = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: -1;
`

const HeroBackground = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  
  useWindowResize(useThrottledFn(event => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }))

  const getVideoSrc = () => {
    const aspectRatio = width / height

    if (aspectRatio < 4/5) return BEAST_800_1600
    if (aspectRatio < 5/4) return BEAST_1000_1000
    return BEAST_1920_1080
  }

  return (
    <StyledBackground>
      <video width="100%"  preload='auto' loop autoPlay muted webkit-playsinline="true">
        <source src={getVideoSrc()} type="video/mp4" />
      </video>
    </StyledBackground>
  )
}

export default HeroBackground;