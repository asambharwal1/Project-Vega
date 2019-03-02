import React, {Component} from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import VehicleDetail from './components/VehicleDetail';
import VehicleForm from './components/VehicleForm';
import Callback from './components/Callback';
import Auth from './Auth/Auth.js';
const auth = new Auth(this);
class App extends Component {
  
  render = () => {
    return (
      <Layout auth={auth}>
          <Route exact path='/' render={(props) => <Home {...props} auth={auth}/>} />
          <Route path='/vehicles/:startDateIndex?'render={(props) => <FetchData {...props} auth={auth}/>}/>
          <Route path='/vehicle/new' render={(props) => <VehicleForm {...props} auth={auth}/>}/>
          <Route path='/vehicle/view/:id' render={(props) => <VehicleDetail {...props} auth={auth}/>}/>
          <Route path='/vehicle/update/:id' render={(props) => <VehicleForm {...props} auth={auth}/>}/>
          <Route path='/callback' render={(props) => <Callback {...props} auth={auth}/>}/>
      </Layout>
    );
  }

}

export default App;

