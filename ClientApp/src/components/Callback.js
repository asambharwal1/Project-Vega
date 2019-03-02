import React, {Component} from 'react';
import { Redirect } from 'react-router'

class Callback extends Component{ 
  componentDidMount() {
    this.props.auth.handleAuthentication();
    this.props.history.replace("/vehicles");
  }

  render(){
    return (
      <div>
        {this.props.auth.isAuthenticated() && <Redirect to={"/vehicles"}/>}
      </div>
    );
  }
}
export default Callback;
