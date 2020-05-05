import React from 'react';

import { withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Form from './Form';
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

class LabelMaker extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.canvasRef = React.createRef();

    this.state = {
      generate: false,
      name: '',
      nric: '',
      bed_no: '',
      cat_status: '1',
      admission_date: Date.now(),
      allergies: '',
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
    this.props.onPrint();
  }

  render()
  {
    const {classes} = this.props;

    if (this.props.print) this.handlePrint();
    
    return (
        <React.Fragment>
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
              <Label canvasRef={this.canvasRef} {...this.state} {...this.props}/>
            </Grid>
          </Grid>
        </Paper>
        </React.Fragment>
  );}
}

export default withStyles(styles, {withTheme: true})(LabelMaker);