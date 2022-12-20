import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PageNotFound = (props) => {
    return (
        <div className="Stevens-Background">
            <Container>
                <Row className="row">
                    <Col className="col">
                        <div className='d-grid'>
                            <img alt="MakeEventHappen" src={require('../img/logo_transparent.png')} style={{height:"20rem",width:"20rem",marginLeft:"auto",marginRight:"auto"}}/>
                            <h1>404 Error</h1>
                            <h1>Resource Not Found</h1>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PageNotFound;