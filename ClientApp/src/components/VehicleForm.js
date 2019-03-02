import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/VehicleMM';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class VehicleForm extends Component{ 
    state = {
        id: -1,
        make : -1,
        model : -1,
        isEditing: false,
        registerDetails: {
            modelId: -1,
            isRegistered: true,
            contact : {
              name: "",
              email: "",
              phone: ""
            },
            features: []
        },
        valid : {
            make : true,
            model : true,
            isRegistered: true,
            contact : {
                name : true,
                email: true
            },
        }
    }

    componentWillMount(){
        if (this.props.match.params.id) {
            this.props.requestMakes(this.props.match.params.id)
            this.setState({isEditing: true});
        } else {
            this.props.requestMakes('');
        }
    }

    componentDidMount() {
        if (localStorage.userProfile && !this.props.match.params.id) {
            var json = JSON.parse(localStorage.userProfile);
            var registerDets = this.state.registerDetails;
            registerDets.contact.name = json.nickname;
            registerDets.contact.email = json.name;
            this.setState({registerDetails: registerDets});
        }
    }

    renderMakes = (props) => {
        return props.makes.map( (item, i) => 
            <option key={item.id} value={item.id}>{item.name}</option>
        );
    }

    renderModels = (props) => {
        if (this.state.make === -1 || props.make===[]) {
            return;
        }
        const makeId = this.state.make ;
        return props.makes.find(make => make.id === makeId).models.map((item, i) =>
            <option key={item.id} value={item.id}>{item.name}</option>
        );
    }

    renderFeatures = (props) => {
        return props.features.map ((item, i) => 
        <div key={i} className="checkbox">
            <label>
                <input type="checkbox" checked={this.state.registerDetails.features.includes(item.id)} key={i} id={item.id} value={item.id} onChange={(val) =>{this.editFeaturesData(val.target.value)}}/>
                {item.name}
            </label>
        </div>
        );
    }

    editData = (key, value)  => {
        var st = this.state.registerDetails;
        st[key] = value;
        this.setState({registerDetails: st});
    }
    
    editContactData = (key, value) => {
        var st = this.state.registerDetails;
        st.contact[key] = value;
        this.setState({registerDetails: st});
    }
    
    editFeaturesData = (value) => {
        const st = this.state.registerDetails;
        var array = st.features;
        var intVal = parseInt(value, 10);
        if (array.includes(intVal)) {
          array.splice(array.indexOf(intVal), 1);
        } else array = [...array, intVal];
        st.features = array;
        this.setState({registerDetails: st});
    }

    formIsValid = () => {
        var form = this.state.registerDetails;
        return (form.modelId!==-1) 
        && (form.isRegistered!==null) 
        && (form.contact.name !== "") 
        && (form.contact.email !== "")
    }

    submit = () => {
        if (this.formIsValid()) {
            toast.success( (((this.props.match.params.id))?"Updated Vehicle!":"Vehicle Added!"))
            if (this.props.match.params.id) {
                const {getAccessToken} = this.props.auth;
                fetch('/api/vehicles/'+this.props.match.params.id, {
                    method: "PUT",
                    headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json' , 'Authorization': `Bearer ${getAccessToken()}`},
                    body: JSON.stringify(this.state.registerDetails),
                }).then( response => console.log(response));
                this.props.history.push('/');
            } else {
                const {getAccessToken} = this.props.auth;
                fetch('/api/vehicles', {
                    method: "POST",
                    headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json' , 'Authorization': `Bearer ${getAccessToken()}`},
                    body: JSON.stringify(this.state.registerDetails),
                }).then( response => console.log(response));
            }
        } else {
            toast.error("Check the required fields!")
        }
    }

    validateSelector = (key) => {
        var val = this.state.valid;
        val[key] = this.state[key] !== -1;
        this.setState({valid: val})
    }

    validateContacts = (key) => {
        var val = this.state.valid;
        val.contact[key] = this.state.registerDetails.contact[key] !== "";
        this.setState({valid: val});
    }

    updateValues = (props) => {
        if (this.state.isEditing) {
            if (props.vehicle.model && props.vehicle.make && props.vehicle.contact) {
                if (props.vehicle.make.id !== this.state.make) this.setState({make: this.props.vehicle.make.id})
                if (props.vehicle.model.id !== this.state.model) {
                    this.setState({model: this.props.vehicle.model.id})
                    var veh = this.state.registerDetails;
                    veh.modelId = props.vehicle.model.id;
                    this.setState({registerDetails: veh})
                }
                if (props.vehicle.contact !== this.state.registerDetails.contact) {
                    var vehC = this.state.registerDetails;
                    vehC.contact = props.vehicle.contact;
                    this.setState({registerDetails: vehC});
                }
                if (props.vehicle.isRegistered !== this.state.registerDetails.isRegistered) {
                    var vehR = this.state.registerDetails;
                    vehR.isRegistered = props.vehicle.isRegistered;
                    this.setState({registerDetails: vehR});
                }
                if (props.vehicle.features !== this.state.registerDetails.features) {
                    var features = [];
                    props.vehicle.features.forEach(element => {
                        var id = element.id;
                        features = [...features, id]
                    });
                    var vehF = this.state.registerDetails;
                    vehF.features = features;
                    this.setState({registerDetails: vehF})
                }

                this.setState({isEditing: false})
            }
            
        }
        return <div/>;
    }

    renderError = (errorForm) => {
        return (
        <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span className="sr-only">Error:</span>
            Enter a valid {errorForm}
        </div>);
    }

    deleteVehicle = () => {
        const {getAccessToken} = this.props.auth;
        fetch('/api/vehicles/'+this.props.match.params.id, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${getAccessToken()}`},
            body: JSON.stringify(this.state.registerDetails),
        }).then( response => console.log(response));    
        this.props.history.push('/');
    }

    render(){
        return (
            <form>
            <h1>{this.props.match.params.id? this.state.registerDetails.contact.name+"'s Vehicle" : "New Vehicle"}</h1>
            <hr/>
            {this.state.isEditing && this.updateValues(this.props)}
            <div className="form-group">
                <label htmlFor="make">Make</label>
                <select value={this.state.make} className="form-control" id="make"
                        onBlur={()=>this.validateSelector("make")} 
                        onChange={(val) => {this.setState({make: val.target.value}); if(val.target.value === "-1") this.editData("modelId", "-1")}}>
                    <option key={0} value={-1}>Select Make</option>
                    {this.renderMakes(this.props)}
                </select>
                {(!this.state.valid.make && this.state.make === -1) && this.renderError("Make!")}
            </div>

            <div className="form-group">
                <label htmlFor="model">Model</label>
                <select value={this.state.model} className="form-control" id="model" 
                            onBlur={() => this.validateSelector("model")} 
                            onChange={(val) => {if (val !== null) {this.setState({model: val.target.value}); this.editData("modelId", val.target.value)}}}>
                    <option key={0} value={-1}>Select Model</option>
                    {this.renderModels(this.props)}
                </select>
                {(!this.state.valid.model && this.state.model === -1) && this.renderError("Model!")}
            </div>
            <div className="form-group">
                <label htmlFor="registered">Has the car been registered?</label>
                <br/>
                <div className="radio-inline">
                    <label>
                        <input type="radio" name="optionsRadios" id="registered" checked={this.state.registerDetails.isRegistered} onChange={(val)=>this.editData("isRegistered", true)}/>
                        Yes
                    </label>
                </div>
                <div className="radio-inline">
                <label>
                    <input type="radio" name="optionsRadios" id="notRegistered" checked={!this.state.registerDetails.isRegistered} onChange={(val)=>{this.editData("isRegistered", false)}}/>
                    No
                </label>
                </div>
            </div>

            <div className="form-group">
                <h2>Features</h2>
                {this.renderFeatures(this.props)}
            </div>

            <h2>Contact</h2>
            <div className="form-group">
                <label htmlFor="contactName">Name</label>
                <input placeholder="John Smith.." id="contactName" value={this.state.registerDetails.contact.name} type="text" className="form-control" onBlur={()=>this.validateContacts("name")} onChange={(val) => {this.editContactData("name", val.target.value)}}/>
                {!this.state.valid.contact.name && this.renderError("name.")}
            </div>


            <div className="form-group">
                <label htmlFor="contactPhone">Phone</label>
                <input placeholder="(111) 111-1111" id="contactPhone" value={this.state.registerDetails.contact.phone} type="text" className="form-control" onBlur={()=>this.validateContacts("email")} onChange={(val) => {this.editContactData("phone", val.target.value)}}/>
            </div>

            <div className="form-group">
                <label htmlFor="contactEmail">Email</label>
                <input placeholder="johnsmith@domain.com" id="contactEmail" value={this.state.registerDetails.contact.email} type="text" className="form-control" onBlur={()=>this.validateContacts("email")} onChange={(val) => {this.editContactData("email", val.target.value)}}/>
                {!this.state.valid.contact.email && this.renderError("email address.")}
            </div>

            <button type="button" className="btn btn-primary" onClick={(ev) => this.submit()} disabled={!this.formIsValid()}>Save</button>
            {(this.props.match.params.id) && <button type="button" onClick={(ev) => this.deleteVehicle()} style={{marginLeft:'10px'}} className="btn btn-danger">Delete</button> }
            <ToastContainer autoClose={2000}/>
        </form>
    );
    }
}

export default connect(
    state => state.makes,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(VehicleForm);
