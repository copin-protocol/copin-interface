import { Helmet } from 'react-helmet'

function CustomPageTitle({ title }: { title?: string }) {
  return (
    <Helmet>
      <title>{title ? `${title} - Copin Analyzer` : 'Copin Analyzer'}</title>
    </Helmet>
  )
}

export default CustomPageTitle
