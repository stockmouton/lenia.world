/**
 * This is just a bare minimum responsive grid: if we see the need for a full-fledged onem we might use a library :)
 */

import styled from "styled-components"
import { gridGutterWidth, createMediaQueries} from "../global-styles"

const createTemplateColumnsRule = columns => {
  if (typeof columns === 'undefined') return ''
  
  if (columns.length > 0) {
    return columns.map(columnSize => `${columnSize}fr`).join(' ')
  }
  if (Number.isInteger(columns)) {
    return `repeat(${columns}, 1fr)`
  }
  throw new Error('The Grid component props only accept an integer or an array of integers.')
}

const Grid = styled.div`
  display: grid;
  column-gap: ${gridGutterWidth}px;
  row-gap: ${gridGutterWidth}px;
  width: 100%;

  ${({xs, sm, md, lg, xl, xxl}) => createMediaQueries({
    xs: `grid-template-columns: ${createTemplateColumnsRule(xs)};`,
    sm: `grid-template-columns: ${createTemplateColumnsRule(sm ?? xs)};`,
    md: `grid-template-columns: ${createTemplateColumnsRule(md ?? sm ?? xs)};`,
    lg: `grid-template-columns: ${createTemplateColumnsRule(lg ?? md ?? sm ?? xs)};`,
    xl: `grid-template-columns: ${createTemplateColumnsRule(xl ?? lg ?? md ?? sm ?? xs)};`,
    xxl: `grid-template-columns: ${createTemplateColumnsRule(xxl ?? xl ?? lg ?? md ?? sm ?? xs)};`,
  })}
`

Grid.Cell = styled.div``

export default Grid;