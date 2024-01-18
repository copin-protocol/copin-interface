import styled from 'styled-components/macro'

import { Box } from 'theme/base'

const ARROW_SIZE = 32
const ARROW_POSITION = -16
const DOTS_POSITION = 24
const DOTS_SIZE = 8

const CarouselWrapper = styled(Box)`
  width: 100%;
  .slick-slider {
    position: relative;

    display: block;
    box-sizing: border-box;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    -webkit-touch-callout: none;
    -khtml-user-select: none;
    -ms-touch-action: pan-y;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
  }

  .slick-list {
    position: relative;

    display: block;
    overflow: hidden;

    margin: 0;
    padding: 0;
    border-radius: ${(props: any) => props.borderRadius && props.borderRadius};
  }
  .slick-list:focus {
    outline: none;
  }
  .slick-list.dragging {
    cursor: pointer;
    cursor: hand;
  }

  .slick-slider .slick-track,
  .slick-slider .slick-list {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  .slick-track {
    position: relative;
    top: 0;
    left: 0;

    display: block;
  }

  .slick-track:before,
  .slick-track:after {
    display: table;
    content: '';
  }

  .slick-track:after {
    clear: both;
  }

  .slick-loading .slick-track {
    visibility: hidden;
  }

  .slick-slide {
    display: none;
    float: left;
    overflow: hidden;

    height: 100%;
    min-height: 1px;
  }

  [dir='rtl'] .slick-slide {
    float: right;
  }
  .slick-slide img {
    display: block;
  }
  .slick-slide.slick-loading img {
    display: none;
  }
  .slick-slide.dragging img {
    pointer-events: none;
  }
  .slick-initialized .slick-slide {
    display: block;
  }
  .slick-loading .slick-slide {
    visibility: hidden;
  }
  .slick-vertical .slick-slide {
    display: block;

    height: auto;

    border: 1px solid transparent;
  }
  .slick-arrow.slick-hidden {
    display: none;
  }

  /* Arrows */
  .slick-prev,
  .slick-next {
    font-size: 0;
    line-height: 0;

    position: absolute;
    top: 50%;

    display: flex !important;

    width: ${ARROW_SIZE}px;
    height: ${ARROW_SIZE}px;
    padding: 0;
    -webkit-transform: translate(0, 32px);
    -ms-transform: translate(0, 32px);
    transform: translate(0, 32px);

    cursor: pointer;

    border: none;
    outline: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.primary2};
    & circle {
      color: ${({ theme }) => theme.colors.neutral5};
    }
    z-index: 10;

    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;

    border: 1px solid ${({ theme }) => theme.colors.neutral4};
    // background: ${({ theme }) => theme.colors.neutral5};
    backdrop-filter: blur(20px);
    border-radius: 50%;

    transform: translate(0px, -50%) scale(1);
  }

  .slick-prev:hover:not(.slick-disabled),
  .slick-prev:focus:not(.slick-disabled),
  .slick-next:hover:not(.slick-disabled),
  .slick-next:focus:not(.slick-disabled) {
    // border-color: ${({ theme }) => theme.colors.neutral5};
    // box-shadow: ${({ theme }) => theme.shadows[1]};

    outline: none;
    /* background: transparent; */
  }
  .slick-disabled {
    cursor: not-allowed;
    //color: ${({ theme }) => theme.colors.neutral5};
    opacity: 50%;
  }

  .slick-prev {
    left: ${-1 * ARROW_POSITION}px;
  }

  .collection .slick-prev {
    left: ${-1 * ARROW_POSITION}px;
  }

  .slick-next {
    right: ${-1 * ARROW_POSITION}px;
  }

  .collection .slick-next {
    right: ${-1 * ARROW_POSITION}px;
  }

  /* Dots */
  .slick-dotted.slick-slider {
    margin-bottom: 30px;
  }

  .slick-dots {
    position: absolute;
    bottom: ${-1 * DOTS_POSITION}px;
    left: 0;
    text-align: center;

    display: block;

    width: 100%;
    padding: 0;
    margin: 0;

    list-style: none;
  }
  .slick-dots li {
    position: relative;

    display: inline-block;

    width: ${DOTS_SIZE + 4 * 2}px;
    height: ${DOTS_SIZE + 4 * 2}px;
    margin: 0;
    padding: 0;

    cursor: pointer;
    // @media all and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    //   width: 14px;
    //   height: 14px;
    // }
  }
  .slick-dots li button {
    font-size: 0;
    line-height: 0;

    display: block;

    width: 100%;
    height: 100%;
    padding: ${4}px;

    cursor: pointer;

    color: transparent;
    border: 0;
    outline: none;
    background: transparent;
  }
  .slick-dots li button:hover,
  .slick-dots li button:focus {
    outline: none;
  }
  .slick-dots li button:hover:before,
  .slick-dots li button:focus:before {
    opacity: 0.75;
  }
  .slick-dots li button:before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 50%;
    width: ${DOTS_SIZE}px;
    height: ${DOTS_SIZE}px;

    content: '';
    text-align: center;

    // opacity: 0.2;
    background: ${({ theme }) => theme.colors.neutral4};

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .slick-dots li.slick-active button:before {
    opacity: 1;
    background: ${({ theme, color }) => (color ? color : theme.colors.primary1)};
  }
`

export default CarouselWrapper

export const VerticalCarouselWrapper = styled(CarouselWrapper)`
  .slick-list {
    height: 42px !important;
    @media all and (max-width: ${({ theme }) => {
        return theme.breakpoints.md
      }}) {
      height: 70px !important;
    }
  }
  overflow: hidden;
  border-radius: 8px;
`

export const HorizontalCarouselWrapper = styled(CarouselWrapper)`
  .slick-track {
    display: flex;
    // align-items: center;
  }

  .slick-list {
    overflow: hidden;
    // padding: 8px 0;
  }
  .slick-slide {
    height: auto;
    overflow: visible;
    // padding: 8px;
  }

  .slick-slide > div {
    height: 100%;
  }

  @media screen and (max-width: 1400px) {
    .slick-slider {
      overflow: hidden;
      padding-bottom: ${DOTS_POSITION}px;
    }
    .slick-dots {
      bottom: 0;
    }
  }
`
