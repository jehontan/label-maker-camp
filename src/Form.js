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
    this.handleBedNoChange = this.handleBedNoChange.bind(this);
    this.handleCatStatusChange = this.handleCatStatusChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleAllergiesChange = this.handleAllergiesChange.bind(this);
  }

  // Change Handlers

  handleNameChange(event) {
    this.props.onChange({name: event.target.value});
  }

  handleNricChange(event) {
    this.props.onChange({nric: event.target.value});
  }

  handleBedNoChange(event) {
    this.props.onChange({bed_no: event.target.value});
  }

  handleCatStatusChange(event) {
    this.props.onChange({cat_status: event.target.value});
  }

  handleDateChange(date) {
    this.props.onChange({admission_date: date});
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
                onChange={this.handleNameChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                id="input-nric" 
                label="NRIC/FIN"
                variant="standard"
                fullWidth
                onChange={this.handleNricChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField 
                select
                defaultValue="1"
                id="input-cat-status"
                label="Cat. Status"
                variant="standard"
                align="left"
                fullWidth
                onChange={this.handleCatStatusChange}
              >
                <MenuItem key="1" value="1">Cat 1</MenuItem>
                <MenuItem key="2A" value="2A">Cat 2A</MenuItem>
                <MenuItem key="2A+" value="2A+">Cat 2A+</MenuItem>
                <MenuItem key="2B" value="2B">Cat 2B</MenuItem>
                <MenuItem key="3" value="3">Cat 3</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                id="input-bed-no"
                label="Bed Number"
                variant="standard"
                fullWidth
                onChange={this.handleBedNoChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableToolbar
                  variant="inline"
                  format="dd MMM yyyy"
                  id="date-picker-inline"
                  label="Admission Date"
                  value={this.props.admission_date}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
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