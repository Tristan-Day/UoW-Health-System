import {
  Breadcrumbs, Link
}
  from '@mui/material'

const BreadCrumbGenerator = () => {
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

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      <Link underline='hover' color='inherit' href='/'>WHS</Link>
      {
        paths.map((val, index) => {
          let path = getPathToPoint(index)
          return (
            <Link underline='hover' color='inherit' href={path}>
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </Link>
          )
        })
      }
    </Breadcrumbs>
  )
}

export default BreadCrumbGenerator