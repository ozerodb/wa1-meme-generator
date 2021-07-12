import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

import { Container, Spinner, Row, Button } from 'react-bootstrap';

import { LoginComponent } from './components/login';
import { AppNavbar } from './components/app-navbar';
import { MemesList, MemeModal, MemeCreator, MemeCombiner } from './components/meme'
import { CustomPageNotFound } from './components/custom-page-not-found';

import API from './API';
import { templates } from './templates';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [changed, setChanged] = useState(false);
  const [userInfo, setUserInfo] = useState(undefined);
  const [message, setMessage] = useState({ msg: '', type: '' });
  const [memesInfos, setMemesInfos] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(-1);
  const [showModal, setShowModal] = useState(false);

  /* AUTH */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo();
        setLoggedIn(true);
        setUserInfo(userInfo);
      } catch (err) {
        console.error(err.error);
      }
      setChanged(true);
      setChecking(false);

    };
    checkAuth();
  }, []);

  const userLoginCallback = async (email, password) => {
    try {
      const userInfo = await API.login({ username: email, password: password });
      setMessage({ msg: `Welcome, ${userInfo.name}!`, type: 'text-success' });
      setLoggedIn(true);
      setChanged(true);
      setUserInfo(userInfo);
    } catch (err) {
      console.error(err);
      setMessage({ msg: `${err}`, type: 'text-danger' });
    }
  };

  const userLogoutCallback = async () => {
    setChecking(true);
    await API.logout();
    setLoggedIn(false);
    setUserInfo(undefined);
    setChecking(false);
    setChanged(true);
    setCurrentMeme(-1);
    setMessage('');
  }

  /* MEMES */
  // Rehydrate memes at mount time, and when memes are updated
  useEffect(() => {
    if (changed) {
      API.getMemes().then(memes => {
        setMemesInfos(memes);
        setChanged(false);
      });
    }
  }, [changed]);

  const deleteMeme = (id) => {
    API.deleteMeme(id).then(() => setChanged(true));
  }

  const createMeme = (newMeme) => {
    API.createMeme(newMeme).then(() => setChanged(true));
  };

  return (

    <Router>
      <>{checking ? <div className="center-block"><Spinner animation="border" /></div> :
        <>
          <Switch>
            <Route exact path="/login" render={() => (
              <>
                {loggedIn ?
                  <Redirect to='/' /> :
                  <LoginComponent userLoginCallback={userLoginCallback} message={message} />
                }
              </>
            )} />
            <Route path="/" render={() => (
              <>
                <AppNavbar userInfo={userInfo} userLogoutCallback={userLogoutCallback} />
                <Container fluid id="content">
                  <Switch>

                    <Route exact path="/" render={() => (
                      <Redirect to='/memes' />
                    )} />
                    <Route exact path="/memes" render={() => (
                      <>
                        <Container id="memelist-container">
                          <Row className="d-flex justify-content-between w-100 mb-3 align-items-center">
                            <h1 className="inline">Your daily dose of memes</h1>
                            {loggedIn && <Link to='/create'><Button variant="success"><i className="fas fa-plus"></i>  New Meme</Button></Link>}
                          </Row>
                          <MemesList userInfo={userInfo} memesInfos={memesInfos} setCurrentMeme={setCurrentMeme} setShowModal={setShowModal} deleteMeme={deleteMeme} />
                          {showModal && <MemeModal userInfo={userInfo} meme={MemeCombiner(memesInfos[currentMeme], templates[memesInfos[currentMeme].templateId])} memeInfo={memesInfos[currentMeme]} templates={templates} showModal={showModal} setShowModal={setShowModal} />}
                        </Container>
                      </>
                    )} />

                    <Route exact path="/create" render={() => (
                      <>
                        {loggedIn ?
                          <>
                            <Container id="memelist-container">
                              <Row className="d-flex justify-content-between w-100 mb-3 align-items-center">
                                <h1 className="inline">Your daily dose of memes</h1>
                                {loggedIn && <Link to='/create'><Button variant="success"><i className="fas fa-plus"></i>  New Meme</Button></Link>}
                              </Row>
                              <MemesList userInfo={userInfo} memesInfos={memesInfos} setCurrentMeme={setCurrentMeme} setShowModal={setShowModal} deleteMeme={deleteMeme} />
                              </Container>
                            <Container id="memecreator-container">
                              <MemeCreator userInfo={userInfo} templates={templates} createMeme={createMeme} />
                            </Container>
                          </> :
                          <Redirect to='/login' />}
                      </>
                    )} />

                    <Route path="/" render={() => (
                      <CustomPageNotFound />
                    )} />

                  </Switch>
                </Container>
              </>
            )} />
          </Switch>
        </>
      }</>
    </Router>
  );
}

export default App;
