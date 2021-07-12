import { Image, ListGroup, ListGroupItem, Button, Modal, Row, Col, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Link, useLocation, Redirect } from 'react-router-dom';
import { useState } from "react";
import { confirm } from 'react-bootstrap-confirmation';

function Meme(props) {
    const memeInfo = props.memeInfo;

    if (memeInfo != null) {
        const divStyle = {
            position: "relative",
            color: memeInfo.color,
            fontFamily: memeInfo.fontFamily
        }
        return (
            <div className="meme" style={divStyle}>
                <Image src={memeInfo.template} style={{ width: '100%' }} />
                {memeInfo.texts.map((t, i) =>
                    <div key={i} style={{ position: 'absolute', left: t.x, top: t.y, textAlign: 'center', width: '100%', maxWidth: '32%' }}>
                        <p style={{ position: 'relative', left: '-50%', fontSize: 19 }}>{t.text}</p>
                    </div>
                )}
            </div>
        );
    } else {
        return (<></>);
    }

}

function MemeModal(props) {
    const meme = props.meme;

    return (
        <>
            <Modal centered dialogClassName="meme-modal" show={props.showModal} onHide={() => props.setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>"{meme.title}"<small className="text-muted font-italic"> by {meme.creatorName}</small> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Meme memeInfo={meme}></Meme>
                </Modal.Body>
            </Modal>
        </>
    );

}

function MemesList(props) {
    const memesInfos = props.memesInfos;
    const userInfo = props.userInfo;

    const deleteConfirm = async (id) => {
        const confirmDeletion = await confirm('Are you really sure you wish to delete this meme?', { title: 'Confirm deletion', okText: 'Yes', okButtonStyle: 'danger', cancelText: 'No' });
        if (confirmDeletion) {
            props.deleteMeme(id);
        }
    };

    return (
        <>
            {memesInfos == null || memesInfos.length < 1 ?
                <><h3 className="text-muted">No memes available at the moment</h3></> :
                <>
                    <ListGroup style={{ width: '100%' }}>
                        {memesInfos.map((m, i) =>
                            <ListGroupItem key={m.id} className="d-flex justify-content-between align-items-center py-2" >
                                <div className="memelist-item" onClick={() => { props.setCurrentMeme(i); props.setShowModal(true) }}>
                                    <p className="my-0 mx-1" style={{ "fontSize": 22 }}>{m.title}</p>
                                    <span className="my-0 mx-1 text-muted" style={{ "fontSize": 14 }}> by {m.creatorName}{userInfo != null ? (m.isPublic ? <i className="far fa-eye mx-2"></i> : <i className="far fa-eye-slash mx-2"></i>) : <></>}</span>
                                </div>

                                {userInfo != null &&
                                    <div>
                                        {m.creatorId === userInfo.id && <Button onClick={() => deleteConfirm(m.id)} className="mr-2" variant="danger"><i className="far fa-trash-alt"></i>  Delete</Button>}
                                        {<Link to={{
                                            pathname: "/create",
                                            state: { prefill: m }
                                        }}> <Button className="mr-2" variant="primary"><i className="far fa-copy"></i>  Copy</Button></Link>}
                                    </div>}

                            </ListGroupItem>)}

                    </ListGroup>
                </>

            }
        </>
    );
}

function MemeCreator(props) {
    const [show, setShow] = useState(true);
    const templates = props.templates;
    const userInfo = props.userInfo;
    const location = useLocation();
    const prefill = location.state ? (location.state.prefill ? location.state.prefill : undefined) : undefined;
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = () => {
        setShow(false);
    }

    const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
    const fontFamilies = [
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Impact', value: 'Impact, fantasy' },
        { name: 'Comic Sans', value: 'Comic Sans MS, Comic Sans, cursive' }
    ]

    const [memeInfo, setMemeInfo] = useState(prefill ?
        {
            ...prefill,
            id: undefined,
            creatorId: userInfo.id,
            creatorName: userInfo.name,
            copiedFrom: prefill.id
        } :
        {
            id: undefined,
            title: '',
            creatorId: userInfo.id,
            creatorName: userInfo.name,
            templateId: 0,
            isPublic: 1,
            color: '#000000',
            text1: '',
            text2: '',
            text3: '',
            fontFamily: 'Arial, sans-serif'
        });

    const handleSubmit = (event) => {

        event.preventDefault();
        if (memeInfo.title === '') {
            setErrorMessage("Title can't be empty!");
            return;
        }
        if (templates[memeInfo.templateId].x2 == null) {
            setMemeInfo({ ...memeInfo, text2: '' })
        }
        if (templates[memeInfo.templateId].x3 == null) {
            setMemeInfo({ ...memeInfo, text3: '' })
        }

        if ((memeInfo.text1 === '') && (memeInfo.text2 === '') && (memeInfo.text3 === '')) {
            setErrorMessage('At least one text is required!');
            return;
        }
        props.createMeme(memeInfo);
        setSubmitted(true);
    }
    if (show && !submitted) {
        return (
            <>
                <Modal show={show} onHide={handleClose} dialogClassName="memecreator-modal" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{prefill ? 'Copy' : 'New'} meme</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6} style={{ borderRight: '1px solid lightgray', padding: '2em' }}>
                                <Meme memeInfo={MemeCombiner(memeInfo, templates[memeInfo.templateId])} />
                            </Col>

                            <Col md={6} style={{ padding: '1em' }}>

                                <Form>
                                    <div style={{ borderBottom: '1px solid lightgray', margin: 0, padding: '1em' }}>
                                        <Form.Group as={Row} controlId="formTemplate">
                                            <Form.Label column md="2">Template</Form.Label>
                                            <Col md="10">
                                                <Form.Control disabled={prefill ? true : false} as="select" value={memeInfo.templateId} onChange={ev => setMemeInfo({ ...memeInfo, templateId: ev.target.value })}>
                                                    {templates.map((t, i) => {
                                                        return <option key={i} value={i}>{t.name}</option>
                                                    })}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} controlId="formTitle">
                                            <Form.Label column md="2">Title</Form.Label>
                                            <Col md="10">
                                                <Form.Control required type='text' value={memeInfo.title} onChange={ev => setMemeInfo({ ...memeInfo, title: ev.target.value })} />
                                            </Col>
                                        </Form.Group>
                                    </div>

                                    <div style={{ borderBottom: '1px solid lightgray', margin: 0, padding: '1em' }}>
                                        <Form.Group as={Row} controlId="formText1">
                                            <Form.Label column md="2">Text 1</Form.Label>
                                            <Col md="10">
                                                <Form.Control type='text' value={memeInfo.text1} onChange={ev => setMemeInfo({ ...memeInfo, text1: ev.target.value })} />
                                            </Col>
                                        </Form.Group>


                                        {templates[memeInfo.templateId].x2 &&
                                            <Form.Group as={Row} controlId="formText2">
                                                <Form.Label column md="2">Text 2</Form.Label>
                                                <Col md="10">
                                                    <Form.Control type='text' value={memeInfo.text2} onChange={ev => setMemeInfo({ ...memeInfo, text2: ev.target.value })} />
                                                </Col>
                                            </Form.Group>}

                                        {templates[memeInfo.templateId].x3 &&
                                            <Form.Group as={Row} controlId="formText3">
                                                <Form.Label column md="2">Text 3</Form.Label>
                                                <Col md="10">
                                                    <Form.Control type='text' value={memeInfo.text3} onChange={ev => setMemeInfo({ ...memeInfo, text3: ev.target.value })} />
                                                </Col>
                                            </Form.Group>}
                                    </div>

                                    <div style={{ borderBottom: '1px solid lightgray', margin: 0, padding: '1em' }}>
                                        <Form.Group as={Row} controlId="formColor">
                                            <Form.Label column md="3">Text color</Form.Label>
                                            <Col md="9">
                                                <ButtonGroup toggle>
                                                    {colors.map((color, i) => (
                                                        <ToggleButton
                                                            style={{ backgroundColor: color, border: '1px solid lightgray', borderRadius: '5px', width: '2em', height: '2em', margin: '0 0.4em' }}
                                                            key={i}
                                                            type="radio"
                                                            value={color}
                                                            checked={memeInfo.color === color}
                                                            onChange={(ev) => setMemeInfo({ ...memeInfo, color: ev.target.value })}
                                                        >
                                                        </ToggleButton>
                                                    ))}
                                                </ButtonGroup>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formFont">
                                            <Form.Label column md="3">Text font</Form.Label>
                                            <Col md="9">
                                                <ButtonGroup toggle>
                                                    {fontFamilies.map((fontFamily, i) => (
                                                        <ToggleButton
                                                            style={{ border: '1px solid lightgray', borderRadius: '5px', margin: '0 0.5em', fontFamily: fontFamily.value }}
                                                            key={i}
                                                            type="radio"
                                                            variant="light"
                                                            value={fontFamily.value}
                                                            checked={memeInfo.fontFamily === fontFamily.value}
                                                            onChange={(ev) => setMemeInfo({ ...memeInfo, fontFamily: ev.target.value })}
                                                        >
                                                            {fontFamily.name}
                                                        </ToggleButton>
                                                    ))}
                                                </ButtonGroup>
                                            </Col>
                                        </Form.Group>
                                    </div>
                                    <div style={{ margin: 0, padding: '1em' }}>
                                        <Form.Group as={Row} controlId="formVisibility">
                                            <Form.Label column md="3">Visibility</Form.Label>
                                            <Col md="4">
                                                <Form.Control disabled={prefill && !prefill.isPublic && (prefill.creatorId !== userInfo.id) ? true : false} as="select" value={memeInfo.isPublic} onChange={ev => setMemeInfo({ ...memeInfo, isPublic: ev.target.value })}>
                                                    <option key={1} value={1}>Public</option>
                                                    <option key={0} value={0}>Protected</option>
                                                </Form.Control>
                                            </Col>
                                            <Col md="5">
                                                <Button onClick={handleSubmit} variant="success" className="ml-4">Submit meme</Button>
                                                <Form.Text className="text-danger ml-4">{errorMessage}</Form.Text>
                                            </Col>
                                        </Form.Group>

                                    </div>


                                </Form>
                            </Col>

                        </Row >
                    </Modal.Body>
                </Modal>
            </>
        );
    } else {
        return (
            <Redirect to='/' />
        );
    }

}

function MemeCombiner(memeInfo, template) {
    let meme = {};
    meme.title = memeInfo.title;
    meme.creatorName = memeInfo.creatorName;
    meme.isPublic = memeInfo.isPublic;
    meme.template = template.src;
    meme.texts = [];
    if (template.x1 != null && memeInfo.text1 != null) {
        meme.texts.push({
            text: memeInfo.text1,
            x: template.x1,
            y: template.y1
        })
    }
    if (template.x2 != null && memeInfo.text2 != null) {
        meme.texts.push({
            text: memeInfo.text2,
            x: template.x2,
            y: template.y2
        })
    }
    if (template.x3 != null && memeInfo.text3 != null) {
        meme.texts.push({
            text: memeInfo.text3,
            x: template.x3,
            y: template.y3
        })
    }
    meme.fontFamily = memeInfo.fontFamily;
    meme.color = memeInfo.color;
    return meme;
}

export { Meme, MemeModal, MemesList, MemeCreator, MemeCombiner };