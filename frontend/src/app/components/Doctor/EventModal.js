import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
const EventModal = ({ show, handleClose, event }) => {
    const formattedStartTime = moment(event.start).format('h:mm A');
    const formattedEndTime = moment(event.end).format('h:mm A');

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{event.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Specialty:</strong> {event.specialty}</p>
                <p><strong>Time:</strong> {formattedStartTime} - {formattedEndTime}</p>
                <p><strong>Patient:</strong> {event.patient}</p>
                <p><strong>Doctor:</strong> Dr. {event.doctor}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EventModal;
