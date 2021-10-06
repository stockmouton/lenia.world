import React, { useRef, useEffect, useState } from "react"
import * as d3 from 'd3'
import styled from "styled-components"
import _max from "lodash/max"
const axios = require('axios');

import artifacts from '../artifacts.json'
import { useWeb3 } from "./web3-provider"

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


const LeniaDex = () => {
  const { web3Provider, account } = useWeb3()
  const [contract, setContract] = useState(null)

  const nodeRef = useRef(null);

  // var data = replaceVideoURL(all_metadata)

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
  const key2 = "Spread"

  useEffect(async () => {
    if (nodeRef.current) {
      const contract = web3Provider ? new web3Provider.eth.Contract(artifacts.contracts.Lenia.abi, artifacts.contracts.Lenia.address) : null
        
        const all_metadata = [];
        if (contract) {
            setContract(contract)

            const totalLeniaMinted = await contract.methods.totalSupply().call({ from: account })
            for (let index = 0; index < totalLeniaMinted; index++) {
              const tokenMetadataURI = await contract.methods.tokenURI(index).call({ from: account })
              const response = await axios.get(tokenMetadataURI);
              const tokenMetadata = response.data
              all_metadata.push(tokenMetadata)
            }
        }
        
        const max_key1 = Math.ceil(10 * d3.max(all_metadata, (d) => getValue(d.attributes, key1))) / 10
        const max_key2 = Math.ceil(10 * d3.max(all_metadata, (d) => getValue(d.attributes, key2))) / 10

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
                  <source src="${d.animation_url}" type="video/mp4">
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
        .data(all_metadata)
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
  }, [web3Provider, account])

  return (
    <>
      <StyledSVG ref={nodeRef} width="75%" className="leniadex" viewBox={viewbox}></StyledSVG>
      <StyledTooltip id="leniadex-tooltip"></StyledTooltip>
    </>
  )
}

export default LeniaDex