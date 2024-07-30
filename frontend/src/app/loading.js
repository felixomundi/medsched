import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const Loading = () => {
  return (
    <div className="container text-center my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
            <div className="ms-3">
              <h5 className="text-primary">Loading...</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
