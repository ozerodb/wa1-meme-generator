import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AppNavbar(props) {
    const userInfo = props.userInfo;
    return (
        <Navbar bg="dark" variant="dark" expand="sm" className="d-flex justify-content-center align-items-center">
            <div className="container-fluid justify-content-between align-items-center">
                <Link to="/" >
                    <Navbar.Brand style={{'fontSize':32}} className="d-flex flex-row align-content-center text-decoration-none">
                        <img src="trollface.svg" width="56" height="48" alt="trollface"></img>
                        <p className="m-0">Memes</p>
                    </Navbar.Brand>
                </Link>
                <>{userInfo !== undefined ?
                    <div>
                        <Navbar.Brand className="mx-5">
                            <h3><small>Logged in as <b>{userInfo.name}</b></small></h3>
                        </Navbar.Brand>
                        <Navbar.Brand onClick={props.userLogoutCallback} id="logout-button">
                            Logout
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="mx-2 bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                        </Navbar.Brand>
                    </div> :
                    <>
                        <Link to="/login">
                            <Navbar.Brand id="login-button">
                                Creator login
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="mx-2 bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                                    <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                </svg>
                            </Navbar.Brand>
                        </Link>

                    </>}
                </>
            </div>
        </Navbar>
    );
}

export { AppNavbar };