import React from 'react';
import qrcode from 'qrcode-generator';
import DateFnsAdapter from "@date-io/date-fns";

import { withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
  const p = record;

  const printLeftMargin = props.printer.dpmm*props.printer.marginLeft;
  const printHeight = props.printer.dpmm*(props.printer.labelHeight-2*props.printer.marginTop);
  // const printWidth = props.printer.dpmm*(props.printer.labelWidth-props.printer.marginLeft);
  const printPadding = 50;
  const textSize = 30;
  const textLineSpace = 20;
  const textBlockHeight = 4*textSize + 4*textLineSpace;
  const qrScale = 10;

  // QR Code
  ctx.save()
  ctx.scale(props.printer.scale, props.printer.scale);

  ctx.save();
  ctx.translate(printLeftMargin, 0);
  const qr = qrcode(0,'H');
  qr.addData(record["NRIC/FIN"]);
  qr.make();
  const qrWidth = qr.getModuleCount()*qrScale;
  ctx.translate(printPadding, (printHeight-qrWidth)/2);
  qr.renderTo2dContext(ctx, qrScale);
  ctx.restore();

  ctx.save();
  ctx.translate(printLeftMargin+printPadding+qrWidth+50, (printHeight-textBlockHeight)/2);

  // Field labels
  ctx.font = "bold " + textSize + "px Arial";
  ctx.fillText("Name:", 0, 0);
  ctx.fillText("NRIC/FIN:", 0, (textSize+textLineSpace))
  ctx.fillText("Date of Birth:", 0, 3*(textSize+textLineSpace));
  ctx.fillText("Bed Assignment:", 0, 2*(textSize+textLineSpace));
  ctx.fillText("Drug Allergy:", 0, 4*(textSize+textLineSpace));

  // Field data
  ctx.translate(300, 0);
  ctx.font = "bold "+ textSize +"px Arial";
  ctx.fillText(record["NAME"], 0, 0);
  ctx.fillText(record["NRIC/FIN"], 0, (textSize+textLineSpace))
  ctx.fillText(dateFns.format(new Date(record["DATE OF BIRTH"]), "dd MMM yyyy"), 0, 3*(textSize+textLineSpace));
  ctx.fillText(`${record["SECTOR"]}/${record["TENT"]}/${record["BED NUMBER"]}`, 0, 2*(textSize+textLineSpace));
  ctx.fillText(record["DRUG ALLERGY"], 0, 4*(textSize+textLineSpace));

  ctx.restore();
}


class BulkMaker extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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