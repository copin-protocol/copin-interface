import { LegacyRef, forwardRef } from 'react'
import Slick from 'react-slick'

import CarouselWrapper, { VerticalCarouselWrapper } from './Wrapper'

/* eslint-disable react/display-name */
const Carousel = forwardRef(({ children, color, ...settings }: any, ref?: LegacyRef<Slick>) => {
  const setting = { ...settings, infinite: children.length >= settings.slidesToShow }
  return (
    <CarouselWrapper color={color}>
      <Slick {...setting} ref={ref}>
        {children}
      </Slick>
    </CarouselWrapper>
  )
})

export const VerticalCarousel = forwardRef(({ children, color, ...settings }: any, ref?: LegacyRef<Slick>) => {
  const setting = { ...settings, infinite: children.length >= settings.slidesToShow }
  return (
    <VerticalCarouselWrapper color={color}>
      <Slick {...setting} ref={ref}>
        {children}
      </Slick>
    </VerticalCarouselWrapper>
  )
})

export default Carousel
