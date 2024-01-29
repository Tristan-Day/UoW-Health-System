import { Breadcrumbs, Link } from '@mui/material'

const BreadcrumbGenerator = () => {
  let location = window.location.pathname

  let paths = location.split('/')
  paths = paths.slice(1)

  function getPathToPoint(outsideIndex) {
    let pathToPoint = ''

    paths.forEach((val, index) => {
      if (index <= outsideIndex) {
        pathToPoint += '/' + val
      }
    })

    return pathToPoint
  }

  function formatPathElement(element) {
    if (element.includes('-')) {
      return element
        .split('-')
        .map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
    }
    return element.charAt(0).toUpperCase() + element.slice(1)
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '0.5rem' }}>
      <Link key={'root'} underline="hover" color="inherit" href="/">
        WHS
      </Link>
      {paths.map((element, index) => {
        let path = getPathToPoint(index)
        return (
          <Link key={element} underline="hover" color="inherit" href={path}>
            {formatPathElement(element)}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default BreadcrumbGenerator
