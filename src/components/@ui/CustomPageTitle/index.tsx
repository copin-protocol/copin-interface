import { Helmet } from 'react-helmet'

function CustomPageTitle({ title }: { title?: string }) {
  return (
    <Helmet>
      <title>{title ? `${title}` : 'Trader Explorer'}</title>
    </Helmet>
  )
}

export default CustomPageTitle
