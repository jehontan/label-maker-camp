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
import PrintIcon from '@material-ui/icons/Print';

import Form from './Form'
import Label from './Label';

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
    this.state = {};
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.canvasRef = React.createRef();
  }

  handleGenerate(person) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.setState({person: person});
    this.render();
  }

  handlePrint() {
    const canvas = this.canvasRef.current;
    const img = canvas.toDataURL("image/png");
    console.log(img);
    var a = window.open('', 'Print', 'height=500, width=500'); 
    a.document.write('<img src="'+ img +'"/>');
    a.document.close(); 
    a.print(); 
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
        </Toolbar>
      </AppBar>
      <Container className={classes.container} maxWidth="md">
        <Paper className={classes.paper}>
          <Form classes={this.props} onGenerate={this.handleGenerate} />
        </Paper>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
          <Grid item xs={12}>
              <Label canvasRef={this.canvasRef} labelWidth={252} labelHeight={32} dpmm={12} person={this.state.person}/>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
    </div>
  );}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(App);
