import React, {useState, useEffect } from "react"
import styled from "styled-components"
import {useWindowResize, useThrottledFn} from "beautiful-react-hooks"
import BEAST_800_1600 from "../images/beast-800-1600.mp4"
import BEAST_1000_1000 from "../images/beast-1000-1000.mp4"
import BEAST_1920_1080 from "../images/beast-1920-1080.mp4"

const Video = ({src}) => (
  <video width="100%" preload='auto' loop autoPlay muted playsInline>
    <source src={src} type="video/mp4" />
  </video>
)

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
  const isBrowser = typeof window !== 'undefined'
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 0);
  const [height, setHeight] = useState(isBrowser ? window.innerHeight : 0);
  
  useWindowResize(useThrottledFn(event => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }))

  useEffect(() => {
    if (isBrowser) {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
  }, [])

  const getVideoElement = () => {
    if (width === 0 || height === 0) return <></>

    const aspectRatio = width / height

    if (aspectRatio < 4/5) return <Video src={BEAST_800_1600} />
    if (aspectRatio < 5/4) return <Video src={BEAST_1000_1000} />
    return <Video src={BEAST_1920_1080} />
  }

  return (
    <StyledBackground>
      {getVideoElement()}
    </StyledBackground>
  )
}

export default HeroBackground;