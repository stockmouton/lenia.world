import React, { useEffect, useState } from "react"
import Section from "./section"
import styled from "styled-components"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Label } from 'recharts';
import axios from "axios"
import Grid from "./grid"
import CHANNEL_CHANGE from "../audio/channel-change.wav"
import NavBar from "./navbar";
import MenuTrigger from "./menu-trigger"
import FilterMenu from "./leniadex/filter-menu";
import AxisMenu from "./leniadex/axis-menu";
import LeniaList from "./leniadex/lenia-list"
import Link from "./link";
import STATIC_NOISE_IMAGE from "../images/static-noise.gif"
import { createMediaQuery, BREAKPOINTS, gridBreakpoints } from "../global-styles"
import { useMediaQuery } from 'beautiful-react-hooks'; 
import TextInput from "./text-input";

const LENIADEX_STATUSES = {
  LOADING: "LOADING",
  LOADING_FAILURE: "LOADING_FAILURE",
  READY: "READY",
}
const ALL_METADATA_URI = "https://ipfs.io/ipfs/QmdGzCErzGgoAmaTLK1qtBoA8CedGcoEGe5H3T4L1SFTds"

const ATTRIBUTES = {
  AURA: "Aura",
  AVOIDANCE: "Avoidance",
  COLORMAP: "Colormap",
  FAMILY: "Family",
  KI: "Ki",
  ROBUSTNESS: "Robustness",
  SPREAD: "Spread",
  VELOCITY: "Velocity",
  WEIGHT: "Weight",
}
const NUMERICAL_ATTRIBUTES = [ATTRIBUTES.AURA, ATTRIBUTES.AVOIDANCE, ATTRIBUTES.KI, ATTRIBUTES.ROBUSTNESS, ATTRIBUTES.SPREAD, ATTRIBUTES.VELOCITY, ATTRIBUTES.WEIGHT]
const NUMERICAL_ATTRIBUTE_DOMAINS = {
  [ATTRIBUTES.AURA]: [0, 10],
  [ATTRIBUTES.AVOIDANCE]: [0, 0.5],
  [ATTRIBUTES.KI]: [0, 6],
  [ATTRIBUTES.ROBUSTNESS]: [0, 1],
  [ATTRIBUTES.SPREAD]: [0, 12],
  [ATTRIBUTES.VELOCITY]: [0, 1],
  [ATTRIBUTES.WEIGHT]: [0, 10],
}
const RADAR_CHART_ORDERED_ATTRIBUTES = [ATTRIBUTES.VELOCITY, ATTRIBUTES.WEIGHT, ATTRIBUTES.KI, ATTRIBUTES.ROBUSTNESS, ATTRIBUTES.AVOIDANCE, ATTRIBUTES.AURA, ATTRIBUTES.SPREAD]
const FAMILIES = ["Aerium", "Amphibium", "Aquarium", "Etherium", "Genesis", "Ignis", "Kaleidium", "Maelstrom", "Nexus", "Oscillium", "Pulsium", "Terrarium"]
const COLORMAPS = ["Alizarin", "Black White", "Carmine Blue", "Cinnamon", "City", "Golden", "Laurel", "Msdos", "Pink Beach", "Rainbow", "River Leaf", "Salvia", "Summer", "White Black"]


const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const normalize = (number, max) => number / max

const Wrapper = styled.div`
  border: 1px solid #fefe54;
  box-shadow: 7px 7px 0 rgba(254, 254, 84, 0.15);
`

const SearchInput = styled(TextInput)`
  width: 40px;
  height: 27px;
  font-size: 0.9rem;
  padding: 0 3px;
`

const Body = styled.div`
  height: 602px;
  display: flex;

  @media (min-width: 602px) {
    height: 754px;
  }

  ${createMediaQuery(BREAKPOINTS.sm, 'height: 696px;')}
`

const LeniaPortrait = styled.div`
  background-color: #bbbbbb;
  color: #000000;
  padding: 10px;
  max-width: 300px;
  height: 100%;

  ${createMediaQuery(BREAKPOINTS.sm, 'max-width: 250px;')}
  ${createMediaQuery(BREAKPOINTS.md, 'max-width: 300px;')}
`

const LeniaMap = styled.div`
  background: #232323;
  box-shadow: inset 0 0 0.6rem #101010;
  position: relative;
  width: 100%;
  height: 100%;
`

const OverlayWrapper = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  font-size: 2.6rem;
`

const Video = styled.video`
  border: 4px solid #232323;
  border-radius: 5px;
  color: #ffffff;
  width: 200px;
  height: 200px;

  @media (min-width: 430px) {
    width: 274px;
    height: 274px;
  }

  ${createMediaQuery(BREAKPOINTS.sm, `
    width: 230px;
    height: 230px;
  `)}

  ${createMediaQuery(BREAKPOINTS.md, `
    width: 274px;
    height: 274px;
  `)}
`
const Screen = styled.div`
  box-shadow: inset 0 0 1rem #000000;
  background-image: url(${STATIC_NOISE_IMAGE});
  background-size: cover;
  color: #ffffff;
  font-size: 1rem;
  border-radius: 5px;
`

const VideoScreen = styled(Screen)`
  margin: 1rem 0;
  width: 100%;
  height: 0;
  padding: 0 0 100% 0;
`

const TextScreen = styled(Screen)`
  box-shadow: inset 0 0 0.6rem #101010;
  background: #00aaaa;
  padding: 0.5rem;
  text-align: center;
`

const EmptyTextScreen = styled(Screen)`
  min-height: 2.5rem;
`

const LinkScreen = styled(Link)`
  display: block;
  background-image: url(${STATIC_NOISE_IMAGE});
  background-size: cover;
  box-shadow: inset 0 0 0.6rem #101010;
  background: #00aaaa;
  font-size: 1rem;
  border-radius: 5px;
  padding: 0.5rem;
  text-align: center;
  
  :hover {
    background: #aa5500;
  }
`

const RadarChartWrapper = styled(Screen)`
  background: #232323;
  margin: 1rem 0;

  text {
    fill: #ffffff;
    font-size: 0.7rem;
  }
`

const Dot = styled.circle`
  cursor: pointer;
`

const Legend = styled.div`
  color: #ffffff;
  font-size: 0.9rem;
`

const ScatterResults = styled(Legend)`
  float: right;
  margin: 0.3rem 0.3rem 0 0;
`

const AppliedFilters = styled(Legend)`
  margin: 25px 0 0 60px;
`

const CustomScatterDot = ({ cx, cy, radius, fill }) => {
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={radius}
      stroke='#b2a066'
      strokeWidth={1}
      fill={fill}
    />
  );
};

const audio = new Audio(CHANNEL_CHANGE);
audio.volume = 0.05
audio.playbackRate = 4

const LeniaDex = () => {
  const [leniaDexStatus, setLeniaDexStatus] = useState(LENIADEX_STATUSES.LOADING)
  const [radarData, setRadarData] = useState([])
  const [allScatterData, setAllScatterData] = useState([])
  const [filteredScatterData, setFilteredScatterData] = useState([])
  const [displayedLenia, setDisplayedLenia] = useState(null)
  const [hoveredDot, setHoveredDot] = useState(null)
  const [xAxis, setXAxis] = useState(ATTRIBUTES.WEIGHT)
  const [yAxis, setYAxis] = useState(ATTRIBUTES.VELOCITY)
  const [familyFilters, setFamilyFilters] = useState([])
  const [colormapFilters, setColormapFilters] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [scatterRenderKey, setScatterRenderKey] = useState(0)
  const isAboveMobile = useMediaQuery(`(min-width: 430px)`);
  const isUnderSm = useMediaQuery(`(max-width: ${gridBreakpoints.sm - 1}px)`);
  const isAboveSm = useMediaQuery(`(min-width: ${gridBreakpoints.sm}px)`);
  const isAboveMd = useMediaQuery(`(min-width: ${gridBreakpoints.md}px)`);

  const handleXAxisMenuClick = attribute => {
    if (attribute === yAxis) {
      setXAxis(yAxis)
      setYAxis(xAxis)
      return
    }
    setXAxis(attribute)
  }

  const handleYAxisMenuClick = attribute => {
    if (attribute === xAxis) {
      setXAxis(yAxis)
      setYAxis(xAxis)
      return
    }
    setYAxis(attribute)
  }

  const handleDotMouseOver = lenia => {
    setHoveredDot(lenia.id)
  }

  const handleDotMouseLeave = () => {
    setHoveredDot(null)
  }

  const handleLeniaClick = lenia => {
    setDisplayedLenia(radarData[lenia.id])
    audio.play();
  }

  const handleFamilyFilterClick = family => {
    setFamilyFilters(filters => {
      if (filters.includes(family)) return filters.filter(f => f !== family)
      return [family, ...filters]
    })
  }

  const handleColormapFilterClick = colormap => {
    setColormapFilters(filters => {
      if (filters.includes(colormap)) return filters.filter(c => c !== colormap)
      return [colormap, ...filters]
    })
  }

  const handleClearAllFamilyFilters = () => {
    setFamilyFilters([])
  }

  const handleClearAllColormapFilters = () => {
    setColormapFilters([])
  }

  const handleInputChange = e => {
    const value = e.target.value
    setInputValue(value)
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
          acc[attribute.trait_type] = attribute.numerical_value ?? attribute.value
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

      setAllScatterData(scatterData)
      setFilteredScatterData(scatterData)
      setRadarData(radarData)
      setLeniaDexStatus(LENIADEX_STATUSES.READY)
    }
  }, [])

  useEffect(() => {
    if (allScatterData.length === 0) return

    const filteredScatterData = allScatterData.filter(lenia => {
      const isFamilyFiltered = familyFilters.length === 0 || familyFilters.includes(capitalize(lenia.Family))
      const isColormapFiltered = colormapFilters.length === 0 || colormapFilters.includes(capitalize(lenia.Colormap))
      const idMatches = inputValue.match(/\d+/g)
      const isMatchingId = idMatches ? idMatches.includes(lenia.id) : true 
      return isFamilyFiltered && isColormapFiltered && isMatchingId
    })

    setFilteredScatterData(filteredScatterData)
    setScatterRenderKey(counter => counter + 1)
  }, [familyFilters, colormapFilters, inputValue])

  const getDisplayedFiltersContent = (filters) => {
    const displayedFilters = filters.filter((_, i) => i < 3)
    const otherFilters = filters.filter((_, i) => i >= 3)
    if (otherFilters.length > 0) {
      return `${displayedFilters.join(', ')} and ${otherFilters.length} more`
    }
    return displayedFilters.join(', ')
  }

  const getRadarChartDimension = () => {
    if (isAboveMd) return 274
    if (isAboveSm) return 230
    if (isAboveMobile) return 274
    return 200
  }

  return (
    <Section id="leniadex">
      <Section.Header><h1>Leniadex</h1></Section.Header>
      <Wrapper>
        <NavBar>
          <NavBar.List>
            <NavBar.Item.AboveSm>
              <MenuTrigger
                menu={
                  <AxisMenu items={NUMERICAL_ATTRIBUTES.filter(attribute => attribute !== xAxis)} onItemClick={handleXAxisMenuClick} />
                }
              >
                X Axis: {xAxis} ▼
              </MenuTrigger>
            </NavBar.Item.AboveSm>
            <NavBar.Item.AboveSm>
              <MenuTrigger
                menu={
                  <AxisMenu items={NUMERICAL_ATTRIBUTES.filter(attribute => attribute !== yAxis)} onItemClick={handleYAxisMenuClick} />
                }
              >
                Y Axis: {yAxis} ▼
              </MenuTrigger>
            </NavBar.Item.AboveSm>
            <NavBar.Item>
              <MenuTrigger
                menu={
                  <FilterMenu items={FAMILIES} filters={familyFilters} onClearAll={handleClearAllFamilyFilters} onFilterClick={handleFamilyFilterClick} />
                }
              >
                Filter: Family ▼
              </MenuTrigger>
            </NavBar.Item>
            <NavBar.Item>
              <MenuTrigger
                menu={
                  <FilterMenu items={COLORMAPS} filters={colormapFilters} onClearAll={handleClearAllColormapFilters} onFilterClick={handleColormapFilterClick} />
                }
              >
                Filter: Colormap ▼
              </MenuTrigger>
            </NavBar.Item>
            <NavBar.Item>
              <NavBar.Text><label>Search by ID:<SearchInput onChange={handleInputChange} value={inputValue} /></label></NavBar.Text>
            </NavBar.Item>
          </NavBar.List>
        </NavBar>
        <Body>
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
              <Video key={displayedLenia?.id} preload='auto' loop autoPlay muted playsInline={true}>
                <source src={`https://lenia.world/metadata/${displayedLenia?.id}.mp4`} type="video/mp4" />
                <p>Couldn't load this Lenia, please use a better browser ;)</p>
              </Video>
            </VideoScreen>
            {displayedLenia ? (
              <RadarChartWrapper>
                <RadarChart width={getRadarChartDimension()} height={getRadarChartDimension()} data={displayedLenia?.attributes} innerRadius={0} outerRadius="75%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="trait_type" />
                  <PolarRadiusAxis domain={[0, 1]} axisLine={false} tick={false} />
                  <Radar dataKey="normalized_value" stroke="#00aaaa" fill="#00aaaa" fillOpacity={0.7} />
                </RadarChart>
              </RadarChartWrapper>
            ) : <VideoScreen />}
            {displayedLenia?.id ? (
              <LinkScreen href={`https://opensea.io/assets/0xe95004c7f061577df60e9e46c1e724cc75b01850/${displayedLenia?.id}`}>
                View on Opensea
              </LinkScreen>
            ) : <EmptyTextScreen />}
          </LeniaPortrait>
          {isAboveSm && (
            <LeniaMap>
              <ScatterResults>{filteredScatterData.length} results</ScatterResults>
              <ResponsiveContainer width="100%" height="90%">
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
                  <CartesianGrid stroke="#ffffff" />
                  <XAxis type="number" dataKey={xAxis} stroke="#ffffff" domain={NUMERICAL_ATTRIBUTE_DOMAINS[xAxis]} tick={{fontSize: '0.9rem'}}>
                    <Label position="bottom" fill="#ffffff">{xAxis.toUpperCase()}</Label>
                  </XAxis>
                  <YAxis type="number" dataKey={yAxis} stroke="#ffffff" domain={NUMERICAL_ATTRIBUTE_DOMAINS[yAxis]} tick={{fontSize: '0.9rem'}}>
                    <Label offset={-15} angle={-90} position="left" fill="#ffffff">{yAxis.toUpperCase()}</Label>
                  </YAxis>
                  <Scatter key={scatterRenderKey} data={filteredScatterData} onMouseOver={handleDotMouseOver} onMouseLeave={handleDotMouseLeave} onClick={handleLeniaClick} shape={CustomScatterDot}>
                    {filteredScatterData.map((entry) => (
                      <Cell
                        key={displayedLenia?.id}
                        radius={entry?.id === hoveredDot || entry?.id === displayedLenia?.id ? 8 : 4}
                        fill={entry?.id === displayedLenia?.id ? "#d33122" : "#fffde3"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              {(familyFilters.length > 0 || colormapFilters.length > 0) && (
                <AppliedFilters>
                  {familyFilters.length > 0 && `Displayed Families: ${getDisplayedFiltersContent(familyFilters)}`}<br />
                  {colormapFilters.length > 0 && `Displayed Colormaps: ${getDisplayedFiltersContent(colormapFilters)}`}
                </AppliedFilters>
              )}
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
            </LeniaMap>
          )}
          {isUnderSm && (
            <LeniaList items={filteredScatterData} onItemClick={handleLeniaClick} />
          )}
        </Body>
      </Wrapper>
    </Section>
  )
}

export default LeniaDex