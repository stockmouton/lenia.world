import { createGlobalStyle } from "styled-components";
import Fixedsys500cWoff2 from "./fonts/Fixedsys500c.woff2";
import Fixedsys500cWoff from "./fonts/Fixedsys500c.woff";
import Fixedsys500cTtf from "./fonts/Fixedsys500c.ttf";

const fontSizeBase = 18
const spaceWidth = fontSizeBase / 2
const gridGutterWidth = spaceWidth * 2

// Define the minimum dimensions at which your layout will change,
// adapting to different screen sizes, for use in media queries.
const gridBreakpoints = {
  xs: 0,
  sm: 12 * 6 * spaceWidth, 
  md: 12 * 8 * spaceWidth,
  lg: 12 * 10 * spaceWidth,
  xl: 12 * 12 * spaceWidth,
}

const createBreakpointMediaQueries = rules => {
  let mediaQueries = '';
  Object.keys(gridBreakpoints).forEach(breakpoint => {
    if (rules[breakpoint] == null) return
    mediaQueries += breakpoint === 'xs' ? `${rules[breakpoint]};` : `
      @media (min-width: ${gridBreakpoints[breakpoint]}px) {
        ${rules[breakpoint]};
      }
    `
  });
  return mediaQueries;
}

export {
  fontSizeBase,
  spaceWidth,
  gridBreakpoints,
  gridGutterWidth,
  createBreakpointMediaQueries,
}

const GlobalStyles = createGlobalStyle`

@font-face {
  font-family: 'DOS';
  src: url(${Fixedsys500cWoff2}) format('woff2'),
       url(${Fixedsys500cWoff}) format('woff'),
       url(${Fixedsys500cTtf}) format('truetype');
}

body {
  background-color: #0e1a8e;
  color: #bbbbbb;
  font-family: 'DOS', Monaco, Menlo, Consolas, "Courier New", monospace;
  font-size: ${fontSizeBase}px;
  line-height: 1.5;
}

a {
  color: #fefe54;
  text-decoration: none;
  background-color: transparent;
}

a:hover, a:focus {
  background: #aa5500;
}

a:hover, a:active {
  outline: 0;
}

a:focus {
  outline: thin solid #333;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  color: #ffffff;
  text-rendering: optimizelegibility;
}

h1 {
  font-size: 1.5rem;
  text-transform: uppercase;
}

h2 {
  text-align: center;
  white-space: nowrap;
}

h3 {
  color: #fe54fe;
}
`;

export default GlobalStyles;