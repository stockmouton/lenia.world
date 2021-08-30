import styled from "styled-components"

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  width: 100%;
`

Grid.Cell = styled.div``

export default Grid;