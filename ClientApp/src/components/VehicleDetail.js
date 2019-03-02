import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/VehicleMM';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import VehicleBasics from './VehicleBasics';
import VehiclePhotos from './VehiclePhotos';

class VehicleDetail extends Component{

  async componentWillMount() {
    if (this.props.match.params) {
      await this.props.requestMakes(this.props.match.params.id);
      await this.props.requestVehiclePhotos(this.props.match.params.id);
    }
  }

  render(){
    return (
      <div>
        <Tabs>
          <TabList>
            <Tab>Basics</Tab>
            <Tab>Photos</Tab>
          </TabList>
          <TabPanel>
            <VehicleBasics history={this.props.history} vehicle={this.props.vehicle} auth={this.props.auth}/>
          </TabPanel>
          <TabPanel>
            <VehiclePhotos photos={this.props.photos} vehicle={this.props.vehicle} auth={this.props.auth}/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default connect(
  state => state.makes,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(VehicleDetail);