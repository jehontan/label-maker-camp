import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNricChange = this.handleNricChange.bind(this);
    this.handleBedSectorChange = this.handleBedSectorChange.bind(this);
    this.handleBedTentChange = this.handleBedTentChange.bind(this);
    this.handleBedNoChange = this.handleBedNoChange.bind(this);
    this.handleDOBChange = this.handleDOBChange.bind(this);
    this.handleAllergiesChange = this.handleAllergiesChange.bind(this);
  }

  // Change Handlers

  handleNameChange(event) {
    this.props.onChange({name: event.target.value});
  }

  handleNricChange(event) {
    this.props.onChange({nric: event.target.value});
  }

  handleBedSectorChange(event) {
    this.props.onChange({bed_sector: event.target.value});
  }

  handleBedTentChange(event) {
    this.props.onChange({bed_tent: event.target.value});
  }

  handleBedNoChange(event) {
    this.props.onChange({bed_no: event.target.value});
  }

  handleDOBChange(date) {
    this.props.onChange({dob: date});
  }

  handleAllergiesChange(event) {
    this.props.onChange({allergies: event.target.value});
  }

  render() {
    return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField 
                id="input-name" 
                label="Name" 
                variant="standard" 
                fullWidth 
                value={this.props.name}
                onChange={this.handleNameChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                id="input-nric" 
                label="NRIC/FIN"
                variant="standard"
                fullWidth
                value={this.props.nric}
                onChange={this.handleNricChange}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField 
                id="input-bed-sector"
                label="Bed Sector"
                variant="standard"
                align="left"
                fullWidth
                value={this.props.bed_sector}
                onChange={this.handleBedSectorChange}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField 
                id="input-bed-tent"
                label="Bed Tent"
                variant="standard"
                align="left"
                fullWidth
                value={this.props.bed_tent}
                onChange={this.handleBedTentChange}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id="input-bed-no"
                label="Bed Number"
                variant="standard"
                fullWidth
                value={this.props.bed_no}
                onChange={this.handleBedNoChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableFuture
                  variant="inline"
                  label="Date of Birth"
                  clearable
                  value={this.props.dob}
                  onChange={date => this.handleDOBChange(date)}
                  format="dd/MM/yyyy"
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                id="input-allergies" 
                label="Drug Allergies"
                variant="standard"
                fullWidth
                onChange={this.handleAllergiesChange}
              />
            </Grid>
          </Grid>
       
    );
  }
}

export default Form;