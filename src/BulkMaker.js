import React from 'react';
import qrcode from 'qrcode-generator';
import DateFnsAdapter from "@date-io/date-fns";

import { withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {listUsers} from './AWSFunctions'

const dateFns = new DateFnsAdapter();

const parse = require('csv-parse');

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

function createLabel(canvas, record, props) {
  canvas.width=props.printer.dpmm*(props.printer.labelWidth-props.printer.marginLeft);
  canvas.height=props.printer.dpmm*(props.printer.labelHeight-2*props.printer.marginTop);
  canvas.style["page-break-after"] = "always";

  const ctx = canvas.getContext("2d");

  const printLeftMargin = props.printer.dpmm*props.printer.marginLeft
  const printHeight = props.printer.dpmm*(props.printer.labelHeight-2*props.printer.marginTop);
  const printPadding = 50;
  const qrWidth = 25*10;
  const textSize = 30;
  const textLineSpace = 20;
  const textBlockHeight = 4*textSize + 4*textLineSpace;
  const catTextHeight = 44;

  // QR Code
  ctx.save();
  ctx.translate(printLeftMargin, 0);
  const qr = qrcode(0,'H');
  qr.addData(record["NRIC/FIN"]);
  qr.make();
  ctx.translate(printPadding, (printHeight-qrWidth)/2);
  qr.renderTo2dContext(ctx, 10);
  ctx.restore();

  // Cat Status
  ctx.save();
  ctx.translate(printLeftMargin, 0)
  ctx.font = "bold 60px Arial";
  let text = record["CAT STATUS"];
  let dim = ctx.measureText(text);
  ctx.translate(printPadding+qrWidth+60+catTextHeight, printHeight/2);
  ctx.rotate(-Math.PI/2);
  ctx.translate(-dim.width/2, 0);
  ctx.fillText(text, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(printLeftMargin+printPadding+qrWidth+60+catTextHeight+50, (printHeight-textBlockHeight)/2);

  // Field labels
  ctx.font = "bold " + textSize + "px Arial";
  ctx.fillText("Name:", 0, 0);
  ctx.fillText("NRIC/FIN:", 0, (textSize+textLineSpace))
  ctx.fillText("Bed:", 0, 2*(textSize+textLineSpace));
  ctx.fillText("Admission:", 0, 3*(textSize+textLineSpace));
  ctx.fillText("Drug Allergy:", 0, 4*(textSize+textLineSpace));

  // Field data
  ctx.font = "bold "+ textSize +"px Arial";
  ctx.fillText(record["NAME"], 200, 0);
  ctx.fillText(record["NRIC/FIN"], 200, (textSize+textLineSpace))
  ctx.fillText(record["BED"], 200, 2*(textSize+textLineSpace));
  ctx.fillText(dateFns.format(new Date(record["ADMISSION DATE"]), "dd MMM yyyy"), 200, 3*(textSize+textLineSpace));
  ctx.fillText(record["DRUG ALLERGY"], 200, 4*(textSize+textLineSpace));

  ctx.restore();
}


class BulkMaker extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handlePullFromDB = this.handlePullFromDB.bind(this);
    this.previewRef = React.createRef();

    this.state = {
      generate: false,
      data: '',
      records: {},
      labels: [],
    };
  }

  handleGenerate() {
    const labels = [];
    const preview = this.previewRef.current;
    preview.innerHTML = '';
    const parser = parse(this.state.data, {columns: true});
    parser.on('readable', ()=>{
      let record;
      // eslint-disable-next-line
      while (record = parser.read()){
        const canvas = document.createElement("canvas");
        createLabel(canvas, record, {...this.props});
        labels.push(canvas.toDataURL());
        preview.appendChild(canvas);
      }
    });

    parser.on('end', ()=>{
      this.setState({labels: labels});
      this.setState({generate: true});
    });

    
  }

  handlePrint() {
    var a = window.open('', 'Print', 'height=500, width=500');
    let label;
    for (label of this.state.labels){
      a.document.write('<img src="'+ label +'" style="page-break-after: always"/>');
    }
    a.onload = ()=>a.print();
    a.document.close();
    this.props.onPrint();
  }

  handleUpload(event) {
    this.setState({generate: false});
    const reader = new FileReader();

    reader.onload = (event) => {
      this.setState({data: event.target.result});
    };
    reader.readAsText(event.target.files[0]);
  }

  handlePullFromDB() {
    console.log('Pulling data...')
    this.setState({generate: false});
    listUsers((err, data) => {
      if (err === null) {
        // All is good
        console.log('Got data.');

        const labels = [];
        const preview = this.previewRef.current;
        preview.innerHTML = '';

        data.forEach(item => {
          const canvas = document.createElement("canvas");
          const record = {};
          record["name"] = item.name;
          record["nric"] = item.finNo;
          record["admission_date"] = item.timeEnrolled;
          record["bed_no"] = `${item.bed.sector}-${item.bed.tent}-${item.bed.serial}`;

          createLabel(canvas, record, {...this.props});
          labels.push(canvas.toDataURL());
          preview.appendChild(canvas);
        });

      } else {
        console.log(err);
      }
    });
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
                Upload CSV
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                Upload File
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={this.handleUpload}
                />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                onClick={this.handlePullFromDB}
              >
                Pull from DB
              </Button>
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
        <Paper ref={this.previewRef} className={classes.paper} style={{height:"50vh", overflow: 'scroll',}}/>
        </React.Fragment>
  );}
}

export default withStyles(styles, {withTheme: true})(BulkMaker);