import { Form, Button, InputGroup, Image } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginComponent(props) {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            props.userLoginCallback(email, password);
        }
        setValidated(true);
    }

    return (
        
        <div className="center-block flex-column" id="login-container">
            <Link to="/" className="d-flex flex-column justify-content-center"><Image src="trollface.svg" width="10%" className="m-auto"/><h1 className="pb-5 mx-auto text-black-50">Memes</h1></Link>
            <Form noValidate validated={validated} onSubmit={handleLogin} className="w-50">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control required type="email" placeholder="Email" onChange={ev => setEmail(ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control required type="password" placeholder="Password" minLength="8" maxLength="20" onChange={ev => setPassword(ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a password between 8 and 20 characters.
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Text className={"mb-3 "+props.message.type}>{props.message.msg}</Form.Text>
                <Button variant="dark" type="submit" className="mt-2">
                    Login
                </Button>
            </Form>
        </div>
    );
}

export { LoginComponent };
