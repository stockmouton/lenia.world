/**
 * This is just a bare minimum responsive grid: if we see the need for a full-fledged onem we might use a library :)
 */

import styled from "styled-components"
import { gridGutterWidth, createMediaQueries} from "../global-styles"

const Grid = styled.div`
  display: grid;
  column-gap: ${gridGutterWidth}px;
  row-gap: ${gridGutterWidth}px;
  width: 100%;

  ${({xs, sm, md, lg, xl, xxl}) => createMediaQueries({
    xs: `grid-template-columns: repeat(${xs}, 1fr);`,
    sm: `grid-template-columns: repeat(${sm ?? xs}, 1fr);`,
    md: `grid-template-columns: repeat(${md ?? sm ?? xs}, 1fr);`,
    xl: `grid-template-columns: repeat(${xl ?? md ?? sm ?? xs}, 1fr);`,
    xxl: `grid-template-columns: repeat(${xxl ?? xl ?? md ?? sm ?? xs}, 1fr);`,
  })}
`

Grid.Cell = styled.div``

export default Grid;