import React, {Component} from 'react';
import { connect } from 'react-redux';

class Home extends Component{ 

  render(){
    return (
      <div style={{justifyContent: 'center'}}>
        <h1 style={{justifyContent: 'center', textAlign: 'center'}}>Vega Car Dealership</h1>
        <img alt=''style={{width: '500px', height:'500px', display : 'block', marginLeft: 'auto', marginRight: 'auto'}} src="https://www.car-brand-names.com/wp-content/uploads/2015/03/Lamborghini-Logo.png"/>
        <h2 style={{fontWeight:'bold', justifyContent: 'center', textAlign: 'center'}}>Welcome to the Vega Car Dealership</h2>
        <p>{this.props.auth.isAuthenticated() && 'Welcome to our database, '+this.props.auth.getProfileName().nickname+'!'}</p>
        <p>The following vehicles are available in our database:</p>
        <ul>
          <li><strong>Ford:</strong> <em>GT</em>, <em>Mustang</em>, <em>Focus</em>.</li>
          <li><strong>BMW:</strong> <em>M3</em>, <em>i8</em>, <em>M850i</em>.</li>
          <li><strong>Lamborghini:</strong><em>Gallardo</em>, <em>Murcielago</em>, <em>Aventador</em>.</li>
        </ul>
        <em>We are actively adding more vehicle makes and models to our database!</em>
      </div>
    );
  }
}
export default connect()(Home);
