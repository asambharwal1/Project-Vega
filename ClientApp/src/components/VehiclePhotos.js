import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/VehicleMM';

class VehicleBasics extends Component{

  state = {
      photo : null
  }
  
  renderPhotos = (props) => {
    return props.photos.map( (item) => 
      <img src={'/uploads/'+item.fileName} alt={item.fileName} style={{marginLeft:'10px'}} className="img-thumbnail" />
    );
  }
  
  handlePhotoUpload = async (val) => {
    var form = new FormData();
    form.append('file', val.target.files[0])
    await fetch('/api/vehicles/'+this.props.vehicle.id+'/photos', {
        method: 'POST',
        body: form
    }).then(
        response => response.blob()
    ).then(
        success => console.log(success) 
    ).catch(
        err => console.log(err)
    );
    await this.props.requestVehiclePhotos(this.props.vehicle.id);
  }

  render() {
    return (
      <div>
        <h2>Photos</h2>
        { this.props.auth.isAuthenticated() && 
        <input value={this.state.photo} type="file" onChange={(val) => this.handlePhotoUpload(val)}/>}
        <br/>
        {this.renderPhotos(this.props)}
        <hr/>
      </div>
    );
  }
}
export default connect(  
    state => state.makes,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(VehicleBasics);
