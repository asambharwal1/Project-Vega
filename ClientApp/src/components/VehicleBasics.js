import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class VehicleBasics extends Component{
  
  renderFeatures = (props) => {
    return props.vehicle.features.map( (item) => 
      <li key={item.id}>{item.name}</li>
    );
  }

  deleteVehicle = () => {
    const {getAccessToken} = this.props.auth;
    fetch('/api/vehicles/'+this.props.vehicle.id, {
        method: "DELETE",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json' , 'Authorization': `Bearer ${getAccessToken()}`}
    }).then( response => console.log(response));    
    this.props.history.push('/');
  } 

  render() {
    return (
      <div>
        { this.props.vehicle && 
        <div>
          <h2>Basics</h2>
          {this.props.vehicle.make &&
          <ul>
            <li>Make: {this.props.vehicle.make.name}</li>
            <li>Model: {this.props.vehicle.model.name}</li>
            <li>Registered: {this.props.vehicle.isRegistered ? "Yes": "No"}</li>
          </ul>}
          <h2>Features</h2>
          {this.props.vehicle.features &&
          <ul>
            {this.renderFeatures(this.props)}
          </ul>}
          <h2>Contact</h2>
          {this.props.vehicle.contact &&
          <ul>
            <li>Contact Name: {this.props.vehicle.contact.name}</li>
            <li>Contact Phone: {this.props.vehicle.contact.phone}</li>
            <li>Contact Email: {this.props.vehicle.contact.email}</li>
          </ul>}
        </div>
        }
        <hr/>
        {(this.props.vehicle && this.props.auth.isAuthenticated()) && 
          <span>
            <Link to={'/vehicle/update/'+this.props.vehicle.id}>
              <button className="btn btn-primary" style={{marginRight: '5px'}}>Edit</button>
            </Link>
            <button className="btn btn-danger" style={{marginRight: '5px'}} onClick={()=>this.deleteVehicle()}>Delete</button>
          </span>
        }
          <Link to={'/vehicles'}>
            <button className="btn btn-light"> View All Vehicles </button>
          </Link>
      </div>
    );
  }
}
export default connect()(VehicleBasics);
