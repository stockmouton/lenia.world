import styled from "styled-components"
import { gridGutterWidth, spaceWidth, createBreakpointMediaQueries } from "../global-styles"

// Define the maximum width of container for different screen sizes.
const containerMaxWidths = {
  sm: spaceWidth * 12 * 5,
  md: spaceWidth * 12 * 7,
  lg: spaceWidth * 12 * 10,
}

const createContainerMaxWidthsRules = () => {
  const rules = {}
  Object.entries(containerMaxWidths).forEach(([bp, maxWidth]) => {
    rules[bp] = `max-width: ${maxWidth}px`;
  })
  return rules;
}

const Container = styled.div`
  width: 100%;
  padding-right: ${gridGutterWidth / 2}px;
  padding-left: ${gridGutterWidth / 2}px;
  margin-right: auto;
  margin-left: auto;

  ${createBreakpointMediaQueries(createContainerMaxWidthsRules())}
`

export default Container