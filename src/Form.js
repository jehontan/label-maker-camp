import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',
                  nric: '',
                  bed_no: '',
                  cat_status: '',
                  admission_date: new Date(),
                  allergies: ''
                };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNricChange = this.handleNricChange.bind(this);
    this.handleBedNoChange = this.handleBedNoChange.bind(this);
    this.handleCatStatusChange = this.handleCatStatusChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleAllergiesChange = this.handleAllergiesChange.bind(this);
  }

  // Change Handlers

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleNricChange(event) {
    this.setState({nric: event.target.value});
  }

  handleBedNoChange(event) {
    this.setState({bed_no: event.target.value});
  }

  handleCatStatusChange(event) {
    this.setState({cat_status: event.target.value});
  }

  handleDateChange(date) {
    this.setState({admission_date: date});
  }

  handleAllergiesChange(event) {
    this.setState({allergies: event.target.value});
  }

  render() {
    return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField id="input-name" label="Name" variant="standard" fullWidth onChange={this.handleNameChange}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField id="input-nric" label="NRIC/FIN" variant="standard" fullWidth onChange={this.handleNricChange}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField id="input-cat-status" label="Cat. Status" variant="standard" fullWidth onChange={this.handleCatStatusChange}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField id="input-bed-no" label="Bed Number" variant="standard" fullWidth onChange={this.handleBedNoChange}/>
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
                  value={this.state.admission_date}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField id="input-allergies" label="Drug Allergies" variant="standard" fullWidth onChange={this.handleAllergiesChange} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={(event)=>{this.props.onGenerate(this.state)}}>Generate</Button>
            </Grid>
          </Grid>
       
    );
  }
}

export default Form;