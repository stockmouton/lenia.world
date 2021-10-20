import styled from "styled-components"
import { gridGutterWidth, spaceWidth, createMediaQueries } from "../global-styles"

// Define the maximum width of container for different screen sizes.
const containerMaxWidths = {
  lg: `${spaceWidth * 12 * 10}px`,
}

const createContainerMaxWidthsRules = () => {
  const rules = {}
  Object.entries(containerMaxWidths).forEach(([bp, maxWidth]) => {
    rules[bp] = `max-width: ${maxWidth}`;
  })
  return rules;
}

const Container = styled.div`
  width: 100%;
  padding-right: ${gridGutterWidth / 2}px;
  padding-left: ${gridGutterWidth / 2}px;
  margin-right: auto;
  margin-left: auto;

  ${createMediaQueries(createContainerMaxWidthsRules())}
`

export default Container