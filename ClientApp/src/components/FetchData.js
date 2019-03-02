import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators } from '../store/VehicleList';
import FontAwesome from 'react-fontawesome';

const PAGE_SIZE = 5;
class FetchData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      make : -1,
      sortBy : {
        type: ''
      },
      isAsc : false
    }
  }
  
  componentWillMount() {
    var query = this.createFinalQuery();
    this.props.requestVehicleMakes();
    this.props.requestFilteredVehicles(query);
  }

  hasNextPage = () => {
    return (this.props.vehicles.length + ((this.state.page-1) * PAGE_SIZE)) === this.props.totalItems;
  }

  renderMakes = (props) => {
    return props.makes.map( (item, i) => 
            <option key={item.id} value={item.id}>{item.name}</option>
        );
  }

  filterVehicles = async (val) => {
    await this.setState({make: val.target.value});
    await this.setState({page: 1});
    var query = this.createFinalQuery();
    this.props.requestFilteredVehicles(query);
  }

  resetFilteration = async (val) => {
    await this.setState({make: val});
    var sortByN = this.state.sortBy;
    sortByN.type = '';
    await this.setState({sortBy: sortByN})

    var query = this.createFinalQuery();

    this.props.requestFilteredVehicles(query);
  }

  createFinalQuery = () => {
    var sortType = this.state.sortBy.type;
    var makeId = this.state.make;
    var query = "?";
    var array = [];
    if (makeId !== -1) {
      array = [...array, (encodeURIComponent("makeId")+"="+encodeURI(this.state.make))];
    }

    if (sortType !== '') {
      array = [...array,
         (encodeURIComponent("sortBy")+"="+encodeURI(this.state.sortBy.type)
         +"&"+encodeURIComponent("isSortAscending")+"="+encodeURI(this.state.isAsc))];
    }

    array = [...array, (encodeURIComponent("pageSize")+"="+encodeURI(PAGE_SIZE)
    +"&"+encodeURIComponent("page")+"="+encodeURI(this.state.page))]

    return (query+array.join("&"));
  }

  queryPage = async (pageNumber) => {
    if (pageNumber < 1) 
      return;
    await this.setState({page: pageNumber});
    var query = this.createFinalQuery();
    this.props.requestFilteredVehicles(query);
  }

  sortByColumn = async (val) => {
    if (this.state.sortBy.type === '' || val !== this.state.sortBy.type) {
      var sortByN = this.state.sortBy;
      sortByN.type = val; 
      await this.setState({sortBy: sortByN});
      await this.setState({isAsc: true});
    } else {
      await this.setState({isAsc: !this.state.isAsc});
    }
    var query = this.createFinalQuery();
    this.props.requestFilteredVehicles(query);
  }

  updateVehiclesQuery = (query) => {
    this.props.requestFilteredVehicles(query);
  }

  renderSortIcon = () => {
    return this.state.isAsc ? <FontAwesome className="fa fa-sort-asc"/>
                : <FontAwesome className = "fa fa-sort-desc"/> ;
  }

  renderPagination = (props) => {
    return <p className='clearfix text-center'>
      <button className='btn btn-default pull-left' onClick={() => this.queryPage(this.state.page-1)} disabled={this.state.page===1}>Previous</button>
      <button className='btn btn-default pull-right' onClick={() => this.queryPage(this.state.page+1)} disabled={this.hasNextPage()}>Next</button>
      {props.isLoading ? <span>Loading...</span> : []}
    </p>;
  }

  renderForecastsTable = (props) => {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Id</th>
            <th onClick={()=>this.sortByColumn("make")}>
              Make
              {this.state.sortBy.type==="make" && this.renderSortIcon()}
            </th>
            <th onClick={()=>this.sortByColumn("model")}>
              Model
              {this.state.sortBy.type==="model" && this.renderSortIcon()}
            </th>
            <th onClick={()=>this.sortByColumn("contactName")}>
              Contact Name
              {this.state.sortBy.type==="contactName" && this.renderSortIcon()}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.vehicles.map((forecast) => 
            <tr key={forecast.id}>
              <td>{forecast.id}</td>
              <td>{forecast.make.name}</td>
              <td>{forecast.model.name}</td>
              <td>{forecast.contact.name}</td>
              <td><Link params={{forecast}} to={'/vehicle/view/'+forecast.id}>View</Link></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        <h1>Registered Vehicles</h1>
        <hr/>
        { this.props.auth.isAuthenticated() && <Link to={'/vehicle/new'}>
          <button className="btn btn-primary" style={{marginBottom:'10px'}}>New Vehicle</button>
        </Link>}
        <div className="well">
          <div className="form-group">
                  <label htmlFor="make">Make</label>
                  <select value={this.state.make} className="form-control" id="make"
                      onChange={(val) => this.filterVehicles(val)}>
                      <option key={0} value={-1}>Select Make</option>
                      {this.renderMakes(this.props)}
                  </select>
          </div>
          <button className="btn btn-info" onClick={()=>this.resetFilteration(-1)}>Reset</button>
        </div>
        {this.renderForecastsTable(this.props)}
        {this.renderPagination(this.props)}
      </div>
    );
  }
}

export default connect(
  state => state.vehicleList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(FetchData);
