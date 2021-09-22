import React, { useRef, useEffect } from "react"
import d3 from "d3"
import styled from "styled-components"
import _max from "lodash/max"

const WRAPPER_ID = 'leniadex'

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
`


// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 }
const width = 400;
const height = 400;
const k = height / width


var data = [{ "name": "lenia #134", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "external_link": "https://lenia.stockmouton.com", "image": "whiteblack.mp4", "animation_url": "on_chain_url", "attributes": [{ "value": "whiteblack", "trait_type": "Colormap" }, { "value": "Magnum", "trait_type": "Spread", "numerical_value": 0.9496652845812821 }, { "value": "Aluminium", "trait_type": "Robustness", "numerical_value": 0.6852146986905608 }], "config": { "kernels_params": [{ "b": "1", "c_in": 0, "c_out": 0, "gf_id": 0, "h": 1, "k_id": 0, "m": -1, "q": 4, "r": 1, "s": -1 }], "world_params": { "R": 13, "T": 10, "nb_channels": 1, "nb_dims": 2, "scale": 1.0 }, "cells": "AAAAAAAAAAAAAAAAAAAAOZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAp\u00f4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC\u00e6FKF\u00d5\u00d0\u00ccAAAAAAAAAAAAAAAAAAAAAAAAAAAAG\u00d6P\u00d5U\u00c5UxV\u00edZ\u00c9\u00e5MH\u00ccAAAAAAAAAAAAAAAADbNAQgK\u00c9T\u00daS\u00c6JjCrAAAAF\u00e3\u00d8Ws\u00f9AAAAAAAAAAAAAAO\u00c6eon\u00c1p\u00c6S\u00e5G\u00c9AAAAAAAAAAAApww\u00ecAAAAAAAAAAAAU\u00fdo\u00f4\u00c3\u00eex\u00ddbjD\u00d4AAAAAAAAAAAAAAf\u00dcgEAAAAAAAAAAUOt\u00f3\u00c3\u00c8r\u00d9dzW\u00d1XBAAAAAAAAAAAAAAi\u00c1LeAAAAAABXP\u00f8k\u00d3mFh\u00cah\u00fbp\u00c4xNzNAAAAAAAAAAAAK\u00f5c\u00f4AAAAAAJ\u00f8VGNWOWY\u00f4pz\u00c3\u00cc\u00cf\u00ce\u00d6\u00f6\u00d9\u00c9g\u00daAAAAAAAAC\u00e2b\u00e7HDAAAAP\u00cfQ\u00d3B\u00fdAAV\u00fdvW\u00ce\u00e6\u00dc\u00d1\u00e9\u00f0\u00f0T\u00f3u\u00cc\u00e5G\u00faAAAAF\u00c5X\u00e5O\u00e4AAA\u00c1UJI\u00dbAAAAAAvq\u00d5t\u00e8w\u00f6F\u00fd\u00fd\u00fd\u00fd\u00fd\u00fd\u00detf\u00f1M\u00e3QNZ\u00c4RGE\u00c9A\u00dcV\u00ceFWAAAAAAAA\u00d4\u00e8\u00ed\u00cb\u00fd\u00fd\u00fac\u00f3\u00da\u00fd\u00fd\u00fa\u00d2\u00d8xp\u00e6fzeRQoAAm\u00e2X\u00c8GQAAAAAAAAE\u00eb\u00ec\u00ca\u00fd\u00fd\u00fd\u00fd\u00e5X\u00e4\u00c8\u00eb\u00f4\u00e1D\u00c9Dpfe\u00d7NQAAAA\u00d6yP\u00e8AAAAAAAAAAXj\u00f9\u00c8\u00fd\u00fd\u00efq\u00e1c\u00df\u00f6\u00d9Y\u00c9Aq\u00d9b\u00e6H\u00deAAAAAA\u00eb\u00fdAAAAAAAAAAAAn\u00fc\u00edB\u00f1\u00da\u00e4v\u00d9\u00de\u00cfRz\u00d6lAS\u00efD\u00cfAAAAAAGD\u00e0AAAAAAAAAAABAt\u00d6\u00d5\u00d6\u00d7\u00f2\u00cfS\u00c2\u00fco\u00efbsLWAAAAAAAAAAJr\u00cfvAAAAAAAAAAUUs\u00e2\u00c2\u00e1yGo\u00d5dDP\u00c1DZAAAAAAAAAAAADBw\u00dcX\u00dfF\u00f6D\u00d6KbVohumNj\u00c4Z\u00faPQE\u00caAAAAAAAAAAAAAAAAAAW\u00fbf\u00eacRZ\u00e9cQb\u00f2ZfSOJxCmAAAAAAAAAAAAAAAAAAAAAAAAHcL\u00eeMNI\u00efGFBvAAAAAAAAAA::1;21;20" }, "tokenID": 134 }]

const all_attributes = data[0].attributes
const all_keys = []
for (let i = 0; i < all_attributes.length; i++) {
  all_keys.push(all_attributes[i]['trait_type'])
}
const key1 = "mass_density_mean"
const max_key1 = 1.
const key2 = "mass_volume_mean"
const max_key2 = _max(data, (a) => a.stats[key2]).stats[key2]

const LeniaDex = () => {
  const nodeRef = useRef(null);

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
          <p>viz_data/${d.relative_url}/</p>
          <img src="./viz_data/${d.relative_url}/last_frame.png">
          <video id="creature_vid" width="256" height="256" autoplay>
              <source src="./viz_data/${d.relative_url}/beast_plasma_128_128.mp4" type="video/mp4">
          Your browser does not support the video tag.
          </video>
          <div>WARNING: Playback rate=3.0!</div>
      `)
          .style("z-index", 1080)
          .style("opacity", 1)

        document.getElementById("creature_vid").playbackRate = 3.0;
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
      dots = dotsGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.stats[key1]); })
        .attr("cy", function (d) { return y(d.stats[key2]); })
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