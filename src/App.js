import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import SettingsIcon from '@material-ui/icons/Settings';

import Form from './Form'
import Label from './Label';
import SettingsDialog from './SettingsDialog';

const config = require('./config.json');

const styles = theme => ({ root: {
                  flexGrow: 1,
                },
                title: {
                  flexGrow: 1,
                },
                container: {
                  padding: theme.spacing(2),
                },
                paper: {
                  margin: theme.spacing(2),
                  padding: '20px',
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleSettingsChanged = this.handleSettingsChanged.bind(this);
    this.canvasRef = React.createRef();

    const savedPrinter = window.localStorage.getItem('printer');

    console.log(config.printers[0]);

    this.state = {
      generate: false,
      name: '',
      nric: '',
      bed_no: '',
      cat_status: '1',
      admission_date: Date.now(),
      allergies: '',
      printer: savedPrinter ? JSON.parse(savedPrinter) : config.printers["B_TD2130N"],
      settingsOpen: false,
    };
  }

  handleFormChange(change) {
    change.generate=false;
    this.setState(change);
  }

  handleGenerate() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.setState({generate: true});
    this.render();
  }

  handlePrint() {
    const canvas = this.canvasRef.current;
    const img = canvas.toDataURL("image/png");
    console.log(img);
    var a = window.open('', 'Print', 'height=500, width=500'); 
    a.document.write('<img src="'+ img +'"/>');
    a.onload = ()=>a.print();
    a.document.close();
  }

  handleSettingsToggle() {
    this.setState({settingsOpen: !this.state.settingsOpen});
  }

  handleSettingsChanged(printer) {
    window.localStorage.setItem('printer', JSON.stringify(printer));
    this.setState({printer: printer});
    console.log(printer);
  }

  render()
  {
    const {classes} = this.props;
    
    return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Label Maker
          </Typography>
          
          <Button color="inherit" startIcon={<PrintIcon />} onClick={this.handlePrint}>Print</Button>
          <IconButton color="inherit" onClick={this.handleSettingsToggle}><SettingsIcon/></IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.container} maxWidth="md">
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" align="left">
                Personal Particulars
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Form classes={this.props} onChange={this.handleFormChange} {...this.state} />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained"
                color="primary" 
                onClick={this.handleGenerate}
              >
                Generate
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" align="left">
                Preview
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Label canvasRef={this.canvasRef} {...this.state}/>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <SettingsDialog printer={this.state.printer} printers={config.printers} open={this.state.settingsOpen} onClose={this.handleSettingsToggle} onSave={this.handleSettingsChanged}/>
    </div>
  );}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(App);
