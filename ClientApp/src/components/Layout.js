import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import NavMenu from './NavMenu';

export default props => (
  <Grid fluid>
    <Row>
      <Col sm={3}>
        <NavMenu history={props.history} auth={props.auth} loggedIn={props.auth.isAuthenticated()}/>
      </Col>
      <Col sm={9}>
        {props.children}
      </Col>
    </Row>
  </Grid>
);
