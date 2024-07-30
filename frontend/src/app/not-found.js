import Link from 'next/link'
 export const metadata = {
  title:"404: Requested resource not found"
 }
export default function NotFound() {
  return (
    <div className="container text-center my-5">
    <div className="row">
      <div className="col-md-12">
        <div className="alert alert-warning" role="alert">
          <h1 className="display-1">404</h1>
          <p className="lead">Oops! The page you are looking for does not exist.</p>
          <Link href="/" className='btn btn-primary'>
           Go back Home
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}