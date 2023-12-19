import { createGlobalStyle } from 'styled-components/macro'

import { FONT_FAMILY } from 'utils/config/constants'

const ThemedGlobalStyle = createGlobalStyle`
  html {
    font-family: ${FONT_FAMILY}, sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.neutral1};
    background-color: ${({ theme }) => theme.colors.neutral7};
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    // scroll-behavior: smooth;
  }
  /* prettier-ignore */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  /* prettier-ignore */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  ol,
  ul {
    list-style: disc;
    list-style-position: inside;
  }
  li:not(:first-child) {
    margin-top: 0px;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
      box-shadow: none;
    }
  }
  [role='button'] {
    cursor: pointer;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    border: 1px solid ${({ theme }) => theme.colors.neutral4};
  }
  ::-webkit-scrollbar-corner {
    background-color: ${({ theme }) => theme.colors.neutral5};
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.neutral4};
  }
  ::-webkit-scrollbar-track {
    padding: 2px;
  }
  /* Slider */
  input[type='range'] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  input:focus,
  textarea:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }
  textarea {
    resize: none;
  }
  input,
  textarea {
    font-size: 16px;
    line-height: 24px;
    color: inherit;
    font-family: ${FONT_FAMILY}, sans-serif;
    -webkit-tap-highlight-color: transparent;
  }
  input[type='range']::-ms-track {
    width: 100%;
    cursor: pointer;
    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  // remove input background color for autocomplete
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    transition: background-color 1s 5000s, color 1s 5000s;
  }
  input[data-autocompleted] {
    background-color: transparent !important;
  }

  input:disabled {
    cursor: not-allowed;
  }

  input::-ms-reveal,
  input::-ms-clear {
        display: none;
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral6};
    width: 100%;
    margin: 0;
  }
  button {
    font-family: ${FONT_FAMILY}, sans-serif;
    font-weight: bold;
    border: none;
    outline: none;
    font-size: 13px;
    line-height: 16px;
    cursor: pointer;
    transition: all 240ms ease;
  }
  a {
    color: ${({ theme }) => theme.colors.primary1};
  }
  .bold,
  bold {
    font-weight: bold;
  }
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${({ theme }) => theme.colors.neutral3};
    opacity: 1; /* Firefox */
  }

  button[disabled] {
    opacity: 0.5;
    // color: ${({ theme }) => theme.colors.neutral4}!important;
    // background: ${({ theme }) => theme.colors.neutral6}!important;
    // border-color: ${({ theme }) => theme.colors.neutral6}!important;
    cursor: not-allowed;
  }
  .circle-pulse {
    position: relative;
  }
  
  .circle-pulse::before,
  .circle-pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: currentColor;
    border-radius: 50%;
    opacity: 1;
    transform: scale(0.2);
    animation: linear 2s infinite circle-pulse-animation;
  }
  
  .circle-pulse::after {
    animation-delay: 1s;
  }
  
  @keyframes circle-pulse-animation {
    0% {
      opacity: 1;
      transform: scale(0.2);
    }
  
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
  @keyframes line-horizontal-animation {
    0% {
      transform: scaleX(0);
      transform-origin: center left;
    }

    50% {
      transform: scaleX(1);
      transform-origin: center left;
    }

    51% {
      transform: scaleX(1);
      transform-origin: center right;
    }

    100% {
      transform: scaleX(0);
      transform-origin: center right;
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes delaySpin {
    0% {
      transform: rotate(0deg);
    }
    90% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes zoomInZoomOut {
    0% {
      transform: scale(1, 1);
    }
    90% {
      transform: scale(1, 1);
    }
    95% {
      transform: scale(1.2, 1.2);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  h1,
  h2,
  h3,
  h4 {
    font-weight: 900;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-top: 0;
    margin-bottom: 0;
  }
  :root {
    --toastify-color-light: #fff;
    --toastify-color-dark:  #000;
    --toastify-color-info:  ${({ theme }) => theme.colors.primary1};
    --toastify-color-success:  ${({ theme }) => theme.colors.green2};
    --toastify-color-warning:  ${({ theme }) => theme.colors.orange1};
    --toastify-color-error:  ${({ theme }) => theme.colors.red1};
    --toastify-color-transparent: rgba(255, 255, 255, 0.7);
    --onboard-primary-500:  ${({ theme }) => theme.colors.primary1};
    --onboard-wallet-button-background: ${({ theme }) => theme.colors.neutral5};
    --onboard-wallet-button-background-hover: ${({ theme }) => theme.colors.neutral4};
    --onboard-warning-700: ${({ theme }) => theme.colors.orange3};
    --onboard-warning-400: ${({ theme }) => theme.colors.orange1};
    --onboard-warning-100: ${({ theme }) => theme.colors.orange2};
    --onboard-wallet-button-border-radius:  6px;
    --onboard-modal-z-index: 99999;
  }

  .wallet-button-container-inner {
    padding: 12px!important;
  }

    .custom_react_tooltip_css {
    background-color: ${({ theme }) => theme.colors.neutral7};
    border: 1px solid ${({ theme }) => theme.colors.neutral4};
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    opacity: 1;
    z-index: 4;
    box-shadow: 0px 0px 6px 6px ${({ theme }) => theme.colors.neutral3}03;
  }
  .custom_react_tooltip_arrow_place_top_css {
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral4};
    border-right: 1px solid ${({ theme }) => theme.colors.neutral4};
    z-index: 4;
  }
  .custom_react_tooltip_arrow_place_bottom_css {
    border-top: 1px solid ${({ theme }) => theme.colors.neutral4};
      border-left: 1px solid ${({ theme }) => theme.colors.neutral4};
    z-index: 4;
  }
  
  // for react image lightbox
  @keyframes closeWindow {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.__react_component_tooltip {
  background: #000!important;
}
.__react_component_tooltip.place-top::after {
  border-top-color: #000!important;
}
.__react_component_tooltip.place-left::after {
  border-left-color: #000!important;
}
.__react_component_tooltip.place-right::after {
  border-right-color: #000!important;
}
.__react_component_tooltip.place-bottom::after {
  border-bottom-color: #000!important;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.chart-tooltip a {
  text-decoration: underline;
}
.time-filter-chart {
  .axis path,
  .axis line:not(.gridline) {
      fill: none;
      stroke: none;
      shape-rendering: crispEdges;
  }
  .tick line:not(.gridline) {
    stroke: none;
  }

  .axis text {
      font-family: ${FONT_FAMILY}, sans-serif;
      font-size: 11px;
      fill: #777E90;
  }

  .selection {
    fill-opacity: 0;
    stroke: none;
  }

}
.EZDrawer .EZDrawer__container {
  background: ${({ theme }) => theme.colors.neutral6};
}
.react-activity-calendar {
  max-width: unset!important;
}
.react-activity-calendar__count {
  line-height: 1;
}
.rc-dropdown {
  z-index: 20000;
}

.hidden {
  display: none;
}

@media (max-width: 992px) {
  body {
    display: flex;
  } 
  body, html {
    height: -webkit-fill-available;
  }
}



//tour
[x-placement|="top"] {
  .__floater__arrow {
    svg {
      transform: scale(0.5);
      transform-origin: top center;
      z-index: 1;
    }
    span:before {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%) translateY(-1px);
      transform-origin: center;
      border: 8px solid;
      border-color: ${({ theme }) => theme.colors.neutral7} transparent transparent transparent;
      z-index: 2;
    }
  }
}
[x-placement|="bottom"] {
  .__floater__arrow {
    svg {
      transform: scale(0.5);
      transform-origin: bottom center;

    }
    span:before {
      display: block;
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(1px);
      transform-origin: center;
      border: 8px solid;
      border-color: transparent transparent ${({ theme }) => theme.colors.neutral7} transparent;
      z-index: 2;
    }
  }
}


`

export default ThemedGlobalStyle
