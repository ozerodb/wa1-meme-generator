import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';

function CustomPageNotFound() {
    return (
        <div className="center-block d-flex flex-column">
            <h1>404, page not found!</h1>
            <Link to="/"><Button variant="dark">Return home</Button></Link>
        </div>
       
    );
}

export { CustomPageNotFound };