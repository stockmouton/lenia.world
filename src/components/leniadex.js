import React, { useEffect, useState } from "react"
import Section from "./section"
import styled from "styled-components"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Label } from 'recharts';
import axios from "axios"
import Grid from "./grid"

const LENIADEX_STATUSES = {
  LOADING: "LOADING",
  LOADING_FAILURE: "LOADING_FAILURE",
  READY: "READY",
}
const ALL_METADATA_URI = "https://ipfs.io/ipfs/QmdGzCErzGgoAmaTLK1qtBoA8CedGcoEGe5H3T4L1SFTds"

const RADAR_CHART_ORDERED_ATTRIBUTES = ["Velocity", "Weight", "Ki", "Robustness", "Avoidance", "Aura", "Spread"]

const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const normalize = (number, max) => number / max

const LeniaWrapper = styled.div`
  position: relative;
  height: 640px;
  display: flex;
  border: 1px solid #fefe54;
  box-shadow: 7px 7px 0 rgba(254, 254, 84, 0.15);
`

const OverlayWrapper = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  font-size: 2.6rem;
`

const LeniaPortrait = styled.div`
  background-color: #bbbbbb;
  color: #000000;
  padding: 10px;
  width: 400px;
  height: 100%;
`

const Video = styled.video`
  border: 4px solid #232323;
  border-radius: 5px;
  color: #ffffff;
`
const Screen = styled.div`
  box-shadow: inset 0 0 1rem #000000;
  background: #232323;
  filter: grayscale(100%);
  color: #ffffff;
  font-size: 1rem;
  border-radius: 5px;
`

const VideoScreen = styled(Screen)`
  margin-top: 1rem;
  width: 100%;
  height: 0;
  padding: 0 0 100% 0;
`

const TextScreen = styled(Screen)`
  box-shadow: inset 0 0 0.6rem #101010;
  background: #51ae5f;
  filter: none;
  padding: 0.5rem;
  text-align: center;
`

const EmptyTextScreen = styled(Screen)`
  min-height: 2.5rem;
`

const RadarChartWrapper = styled(Screen)`
  margin-top: 1rem;

  text {
    fill: #ffffff;
    font-size: 0.7rem;
  }
`
const Dot = styled.circle`
  cursor: pointer;
`

const CustomScatterDot = ({ cx, cy }) => {
  return (
    <Dot
        cx={cx}
        cy={cy}
        r={4}
        stroke='#fefe54'
        strokeWidth={1}
        fill={'#8884d8'} 
    />
  );
};

const LeniaDex = () => {
  const [leniaDexStatus, setLeniaDexStatus] = useState(LENIADEX_STATUSES.LOADING)
  const [radarData, setRadarData] = useState([])
  const [scatterData, setScatterData] = useState([])
  const [displayedLenia, setDisplayedLenia] = useState(null)

  const handleMouseOver = lenia => {
    setDisplayedLenia(radarData[lenia.id])
  }

  useEffect(async () => {
    let allMetadata = [];

    try {
      const response = await axios.get(ALL_METADATA_URI)
      allMetadata = response.data
    } catch (error) {
      setLeniaDexStatus(LENIADEX_STATUSES.LOADING_FAILURE)
    }

    if (allMetadata.length > 0) {
      const scatterData = allMetadata.map(lenia => {
        const formattedAttributes = lenia.attributes.reduce((acc, attribute) => {
          acc[attribute.trait_type] = attribute.numerical_value || attribute.value
          return acc
        }, {})

        return {
          ...formattedAttributes,
          id: lenia.tokenID,
        }
      })

      const attributeMax = RADAR_CHART_ORDERED_ATTRIBUTES.reduce((acc, attributeName) => {
        const max = Math.max(...allMetadata.map(lenia => (lenia.attributes.find(a => a.trait_type === attributeName)).numerical_value))
        acc[attributeName] = max
        return acc
      }, {})

      const radarData = allMetadata.map(lenia => {
        const numericalAttributes = lenia.attributes.reduce((acc, attribute) => {
          const allocatedIndex = RADAR_CHART_ORDERED_ATTRIBUTES.findIndex(value => attribute.trait_type === value)
          if (typeof attribute.numerical_value === 'undefined') {
            return acc
          }
          acc[allocatedIndex] = {
            ...attribute,
            normalized_value: normalize(attribute.numerical_value, attributeMax[attribute.trait_type])
          }
          return acc
        }, [])

        return {
          attributes: numericalAttributes,
          colorMap: (lenia.attributes.find(attribute => attribute.trait_type === 'Colormap')).value,
          family: (lenia.attributes.find(attribute => attribute.trait_type === 'Family')).value,
          id: lenia.tokenID,
        }
      })

      setScatterData(scatterData)
      setRadarData(radarData)
      setLeniaDexStatus(LENIADEX_STATUSES.READY)
    }
  }, [])

  return (
    <Section id="leniadex">
      <Section.Header><h1>Leniadex</h1></Section.Header>
      <LeniaWrapper>
        <LeniaPortrait>
          <Grid md={[1, 2]}>
            <Grid.Cell>
              {displayedLenia ? <TextScreen>#{displayedLenia?.id}</TextScreen> : <EmptyTextScreen />}
            </Grid.Cell>
            <Grid.Cell>
              {displayedLenia ? <TextScreen>Family: {capitalize(displayedLenia?.family)}</TextScreen> : <EmptyTextScreen />}
            </Grid.Cell>
          </Grid>
          <VideoScreen>
            <Video key={displayedLenia?.id} width="100%" height="auto" preload='auto' loop autoPlay muted playsInline={true}>
              <source src={`https://lenia.world/metadata/${displayedLenia?.id}.mp4`} type="video/mp4" />
              <p>Couldn't load this Lenia, please use a better browser ;)</p>
            </Video>
          </VideoScreen>
          {displayedLenia ? (
            <RadarChartWrapper>
              <RadarChart width={274} height={274} data={displayedLenia?.attributes} innerRadius={0} outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="trait_type" />
                <PolarRadiusAxis domain={[0, 1]} axisLine={false} tick={false} />
                <Radar dataKey="normalized_value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </RadarChartWrapper>
          ) : <VideoScreen />}

        </LeniaPortrait>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            width={600}
            height={600}
            margin={{
              left: 0,
              bottom: 30,
              right: 20,
              top: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="Robustness" name="Robustness">
              <Label position="bottom">Robustness</Label>
            </XAxis>
            <YAxis type="number" dataKey="Spread" name="Spread">
              <Label offset={-15} angle={-90} position="left">Spread</Label>
            </YAxis>
            <Scatter name="LeniaDEX" data={scatterData} onMouseOver={handleMouseOver} shape={CustomScatterDot}/>
          </ScatterChart>
        </ResponsiveContainer>
        {leniaDexStatus === LENIADEX_STATUSES.LOADING && (
          <OverlayWrapper>
            Loading...
          </OverlayWrapper>
        )}
        {leniaDexStatus === LENIADEX_STATUSES.LOADING_FAILURE && (
          <OverlayWrapper>
            My bad fellow Lenia lover, couldn't load the LeniaDEX for you
          </OverlayWrapper>
        )}
      </LeniaWrapper>
    </Section>
  )
}

export default LeniaDex