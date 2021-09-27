import React, { useRef, useEffect } from "react"
import * as d3 from 'd3'
import styled from "styled-components"
import _max from "lodash/max"


import all_metadata from "../fake/metadata.json"
import BlackWhiteCreature from "../fake/blackwhite.mp4"
import CarmineBlueCreature from "../fake/carmine-blue.mp4"
import CarmineGreenCreature from "../fake/carmine-green.mp4"
import CinnamonCreature from "../fake/cinnamon.mp4"
import GoldenCreature from "../fake/golden.mp4"
import MSDosCreature from "../fake/msdos.mp4"
import RainbowCreature from "../fake/rainbow.mp4"
import SalviaCreature from "../fake/salvia.mp4"
import WhiteBlackCreature from "../fake/whiteblack.mp4"


const StyledSVG = styled.svg`
  display: block;
  margin: auto;
`

const StyledTooltip = styled.div`
    opacity: 0;
    background-color: white
    border: solid;
    border-width: 1px;
    border-radius: 5px;
    padding: 10px;
    position: fixed;
`

function getValue(attributes, key) {
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i]['trait_type'] == key) {
      return attributes[i]['numerical_value']
    }
  }
}
// function setValue(attributes, key, value) {
//   for (let i = 0; i < attributes.length; i++) {
//     if (attributes[i]['trait_type'] == key) {
//       return attributes[i]['value'] = value
//       break
//     }
//   }
// }
function replaceVideoURL(data) {
  return data.map(
    (d) => {
      console.log(d.image);
      if (d.image == 'blackwhite.mp4'){
        d.image = BlackWhiteCreature
      } else if (d.image == 'carmine-blue.mp4'){
        d.image = CarmineBlueCreature
      } else if (d.image == 'carmine-green.mp4'){
        d.image = CarmineGreenCreature
      } else if (d.image == 'cinnamon.mp4'){
        d.image = CinnamonCreature
      } else if (d.image == 'golden.mp4'){
        d.image = GoldenCreature
      } else if (d.image == 'msdos.mp4'){
        d.image = MSDosCreature
      } else if (d.image == 'rainbow.mp4'){
        d.image = RainbowCreature
      } else if (d.image == 'salvia.mp4'){
        d.image = SalviaCreature
      } else if (d.image == 'whiteblack.mp4'){
        d.image = WhiteBlackCreature
      } 
      return d
    }

  )
}

const LeniaDex = () => {
  const nodeRef = useRef(null);

  var data = replaceVideoURL(all_metadata)

  // set the dimensions and margins of the graph
  const margin = {top: 0, right: 0, bottom: 40, left: 40}
  const svgViewWidth = 400
  const svgViewHeight = 400
  // Thw viewbox defines the coordinate system visible
  // Remeber that the SVG y axis goes downward
  const viewbox = `0, 0, ${svgViewWidth}, ${svgViewHeight}`

  const width = svgViewWidth - margin.left - margin.right
  const height = svgViewHeight - margin.top - margin.bottom;


  const blue = "#ffffff"
  const key1 = "Robustness"
  const max_key1 = Math.ceil(10 * d3.max(data, (d) => getValue(d.attributes, key1))) / 10
  const key2 = "Spread"
  const max_key2 = Math.ceil(10 * d3.max(data, (d) => getValue(d.attributes, key2))) / 10

  useEffect(() => {
    if (nodeRef.current) {
      
      const svg = d3.select(nodeRef.current)
        .append("g")
          .attr("transform",
          `translate(${margin.left}, ${margin.top}, ${margin.right}, ${margin.bottom})`);
      
      // Add X axis
      const scaleX = d3.scaleLinear()
        .domain([0, max_key1])
        .range([margin.left, width]);
      const xAxis = d3.axisTop(scaleX).ticks(4);
      const gx = svg.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
      svg.append("text")
        .attr("transform",
          `translate(${margin.left + width / 2}, ${margin.top + height + 20})`)
        .style("text-anchor", "middle")
        .text(key1);

      // Add Y axis
      const scaleY = d3.scaleLinear()
        .domain([0, max_key2])
        .range([height, 0]);
      const yAxis = d3.axisRight(scaleY).ticks(4);  // Print axis numbers on the left
      const gy = svg.append("g")
        .call(yAxis)
        .attr("transform", `translate(${margin.left}, 0)`)
      svg.append("text")
        .attr("transform", `rotate(-90) translate(${ -height / 2}, ${0})`)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(key2);

      
      const tooltip = d3.select("#leniadex-tooltip")
      const mouseover = (event, d) =>
        tooltip
          // .html(`
          //     <iframe src="lenia?id=${d.tokenID}" width="256px" height="256px"></iframe>
          // `)
          .html(`
              <video id="creature_vid" width="256" height="256" preload='auto' autoplay>
                  <source src="${d.image}" type="video/mp4">
                  Your browser does not support the video tag.
              </video>
          `)
          .style("z-index", 1080)
          .style("opacity", 1)

      const mousemove = (event, d) =>
        tooltip
          .style("left", `${event.x + 20}px`)
          .style("top", `${event.y / 2}px`)

      const mouseleave = (event, d) =>
        tooltip
          .style("opacity", 0)
          .style("z-index", -1)

      // Add dots
      const dotsGroup = svg.append("g")
        .append("g");
      dotsGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return scaleX(getValue(d.attributes, 'Robustness')); })
        .attr("cy", function (d) { return scaleY(getValue(d.attributes, 'Spread')); })
        .attr("r", 2)
        .style("fill", blue)
        // .style("fill", d => z(d.k[0].b))
        .style("opacity", 0.5)
        .style("stroke", "none")
        .style("stroke-width", "0.4px")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }
  }, [])

  return (
    <>
      <StyledSVG ref={nodeRef} width="75%" class="leniadex" viewBox={viewbox}></StyledSVG>
      <StyledTooltip id="leniadex-tooltip"></StyledTooltip>
    </>
  )
}

export default LeniaDex