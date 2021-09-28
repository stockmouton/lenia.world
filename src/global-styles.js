import { createGlobalStyle } from "styled-components";
import Fixedsys500cWoff2 from "./fonts/Fixedsys500c.woff2";
import Fixedsys500cWoff from "./fonts/Fixedsys500c.woff";
import Fixedsys500cTtf from "./fonts/Fixedsys500c.ttf";

const fontSizeBase = 18
const fontSizeBaseMobile = 16
const spaceWidth = fontSizeBase / 2
const gridGutterWidth = spaceWidth * 2

const BREAKPOINTS = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
}

// Define the minimum dimensions at which your layout will change,
// adapting to different screen sizes, for use in media queries.
const gridBreakpoints = {
  xs: 0,
  sm: 12 * 6 * spaceWidth, 
  md: 12 * 8 * spaceWidth,
  lg: 12 * 10 * spaceWidth,
  xl: 12 * 14 * spaceWidth,
  xxl: 12 * 16 * spaceWidth,
}

const createMediaQueries = rules => {
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

const createMediaQuery = (bp, rules, order = 'min') => `
@media (${order}-width: ${gridBreakpoints[bp]}px) {
  ${rules};
}
`

export {
  fontSizeBase,
  spaceWidth,
  gridBreakpoints,
  gridGutterWidth,
  createMediaQueries,
  createMediaQuery,
  BREAKPOINTS,
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
  font-size: ${fontSizeBaseMobile}px;
  line-height: 1.5;

  ${createMediaQuery(BREAKPOINTS.sm, `font-size: ${fontSizeBase}px;`)}
}

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  margin: 0;
  color: #ffffff;
  text-rendering: optimizelegibility;
  line-height: 1;
}

h1 {
  font-size: 1.25rem;
  text-transform: uppercase;

  ${createMediaQuery(BREAKPOINTS.sm, `font-size: 1.5rem;`)}
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

h3 {
  color: #fe54fe;
  margin-bottom: 0.8rem;
}

b {
  color: #f1f1f1;
}

p {
  margin: 0 0 1rem 0;
}

p:last-child {
  margin: 0;
}

img {
  max-width: 100%;
  height: auto;
}

nav li:before {
  content: none;
}

figure {
  margin: 0;
}

ul {
  margin: 0;
}

article {
  margin-top: 3rem;
}
`;

export default GlobalStyles;