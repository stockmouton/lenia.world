import React, { useRef, useEffect } from "react"
import * as d3 from 'd3'
import styled from "styled-components"
import _max from "lodash/max"


import creature_000 from "../fake/000-metadata.json"
import BlackWhiteCreature from "../fake/blackwhite.mp4"
import CarmineBlueCreature from "../fake/carmine-blue.mp4"
import CarmineGreenCreature from "../fake/carmine-green.mp4"
import CinnamonCreature from "../fake/cinnamon.mp4"
import GoldenCreature from "../fake/golden.mp4"
import MSDosCreature from "../fake/msdos.mp4"
import RainbowCreature from "../fake/rainbow.mp4"
import SalviaCreature from "../fake/salvia.mp4"
import WhiteBlackCreature from "../fake/whiteblack.mp4"

const WRAPPER_ID = 'leniadex'

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
`

function getValue(attributes, key) {
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i]['trait_type'] == key) {
      return attributes[i]['numerical_value']
    }
  }
}
function setValue(attributes, key, value) {
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i]['trait_type'] == key) {
      return attributes[i]['value'] = value
      break
    }
  }
}
function replaceVideoURL(data) {
  return data.map(
    (d) => {
      debugger
      if (d.image == 'blackwhite.mp4'){
        d.image= BlackWhiteCreature
      } else if (d.image == 'carmine-blue.mp4'){
        d.image= CarmineBlueCreature
      } else if (d.image == 'carmine-green.mp4'){
        d.image= CarmineGreenCreature
      } else if (d.image == 'cinnamon.mp4'){
        d.image= CinnamonCreature
      } else if (d.image == 'golden.mp4'){
        d.image= GoldenCreature
      } else if (d.image == 'msdos.mp4'){
        d.image= MSDosCreature
      } else if (d.image == 'rainbow.mp4'){
        d.image= RainbowCreature
      } else if (d.image == 'salvia.mp4'){
        d.image= SalviaCreature
      } else if (d.image == 'whiteblack.mp4'){
        d.image= WhiteBlackCreature
      } 
      return d
    }

  )
}

const LeniaDex = () => {
  const nodeRef = useRef(null);

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const width = 400;
  const height = 400;
  const k = height / width
  const blue = "#3DB2FF"
  const key1 = "Robustness"
  const max_key1 = 1.
  const key2 = "Spread"
  const max_key2 = 10.

  var data = replaceVideoURL([creature_000])

  useEffect(() => {
    if (nodeRef.current) {
      const svg = d3.select(nodeRef.current)
        .append("svg")
        .attr("viewBox", [
          0, 0, width, height
        ])
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "block")
        .style("margin", "auto")

      const tooltip = d3.select(nodeRef.current)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, max_key1])
        .range([0, width]);

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, max_key2])
        .range([height, 0]);

      // const z = d3.scaleOrdinal()
      //     .domain(data.map(d => d[2]))
      //     .range(d3.schemeSpectral[4])

      const mouseover = function (event, d) {
        tooltip
          .html(`
          <video id="creature_vid" width="256" height="256" preload='auto' autoplay>
              <source src="${BlackWhiteCreature}" type="video/mp4">
              Your browser does not support the video tag.
          </video>
      `)
          .style("z-index", 1080)
          .style("opacity", 1)

        // document.getElementById("creature_vid").playbackRate = 3.0;
      }

      const mousemove = function (event, d) {
        tooltip
          .style("left", (event.x + 20) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", (event.y) / 2 + "px")
      }

      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      const mouseleave = function (event, d) {
        tooltip
          .style("opacity", 0)
          .style("z-index", -1)
      }

      const onclick = function (event, d) {
        if (currentSelected !== null) {
          currentSelected.style.stroke = "none"
        }
        this.style.stroke = "#000000"
        currentSelected = this
      }

      const dotsGroup = svg.append("g")
        .append("g");

      const gx = svg.append("g")
      svg.append("text")
        .attr("transform",
          "translate(" + (width / 2) + " ," +
          (height - margin.top - 20) + ")")
        .style("text-anchor", "middle")
        .text(key1);
      const gy = svg.append("g")
      // text label for the y axis
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(key2);


      // Add dots
      dotsGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(getValue(d.attributes, 'Robustness')); })
        .attr("cy", function (d) { return y(getValue(d.attributes, 'Spread')); })
        .attr("r", 1)
        .style("fill", blue)
        // .style("fill", d => z(d.k[0].b))
        .style("opacity", 0.5)
        .style("stroke", "none")
        .style("stroke-width", "0.4px")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", onclick)

      const xAxis = (g, x) => g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisTop(x).ticks(12))
        .call(g => g.select(".domain").attr("display", "none"))
      const yAxis = (g, y) => g
        .call(d3.axisRight(y).ticks(12 * k))
        .call(g => g.select(".domain").attr("display", "none"))

      const zoomed = function ({ transform }) {
        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
        dotsGroup.attr("transform", transform);
        gx.call(xAxis, zx);
        gy.call(yAxis, zy);
      }
      const zoom = d3.zoom()
        .scaleExtent([1., 100])
        .on("zoom", zoomed);
      svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
    }
  }, [nodeRef])

  return (
    <div ref={nodeRef} />
  )
}

export default LeniaDex