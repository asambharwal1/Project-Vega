import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export default class NavMenu extends Component { 
  state = {
    loggedIn : false
  }

  updateUserStatus = () => {
    if (this.props.auth.isAuthenticated()){
     this.props.auth.logout();
     this.setState({loggedIn: false});
    } else {
     this.props.auth.login();
     this.setState({loggedIn: true});
    }
  }

  render() {
    return (
  <Navbar inverse fixedTop fluid collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to={'/'}>
          <img style={{width: '30px', height:'30px', display: 'inline-block', marginRight: '5px'}}
          src="https://www.car-brand-names.com/wp-content/uploads/2015/03/Lamborghini-Logo.png"
          alt='Company Logo'/>
          Vega Dealership
         </Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to={'/'} exact>
          <NavItem>
            <Glyphicon glyph='home' /> Home
          </NavItem>
        </LinkContainer>
        <LinkContainer to={'/vehicles'}>
          <NavItem>
            <Glyphicon glyph='th-list' /> Registered Vehicles
          </NavItem>
        </LinkContainer>
        <LinkContainer to={'/vehicle/new'}>
          <NavItem>
            <Glyphicon glyph='plus' /> Add New Vehicle
          </NavItem>
        </LinkContainer>
        <NavItem onClick={()=>{this.updateUserStatus()}}>
            <Glyphicon glyph='user' /> Login / Logout
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);}

}
