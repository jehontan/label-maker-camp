import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';


export default function SettingsDialog (props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const printerItems = Object.entries(props.printers).map((printer) =>
    <MenuItem key={printer[1].type} value={printer[1].type}>{printer[1].name}</MenuItem>
  )

  const [changed, setChanged] = React.useState(false);
  const [printer, setPrinter] = React.useState(props.printer);
  const [disabled, setDisabled] = React.useState(props.printer.type !== "Unknown");

  const handlePrinterTypeChange = (event) => {
    
    let type = event.target.value;

    if (type !== "Unknown") {
      // update everything to match known printer
      setPrinter(props.printers[type]);
      setDisabled(true);
    } else {
      const p = {...printer};
      p.type = type;     
      setPrinter(p);
      setDisabled(false);
    }
    setChanged(true);
  }

  const handleMarginTopChange = (event) => {
    if (event.target.value >= 0) {
      const p = {...printer};
      p.marginTop = event.target.value;
      setPrinter(p);
      setChanged(true);
    }
  }

  const handleMarginLeftChange = (event) => {
    if (event.target.value >= 0) {
      const p = {...printer};
      p.marginLeft = event.target.value;
      setPrinter(p);
      setChanged(true);
    }
  }

  const handleLabelHeightChange = (event) => {
    if (event.target.value >= 0) {
      const p = {...printer};
      p.labelHeight = event.target.value;
      setPrinter(p);
      setChanged(true);
    }
  }

  const handleLabelWidthChange = (event) => {
    if (event.target.value >= 0) {
      const p = {...printer};
      p.labelWidth = event.target.value;
      setPrinter(p);
      setChanged(true);
    }
  }

  const handleResolutionChange = (event) => {
    if (event.target.value >= 0) {
      const p = {...printer};
      p.dpmm = event.target.value;
      setPrinter(p);
      setChanged(true);
    }
  }

  const handleSave = () => {
    props.onSave({...printer});
    setChanged(false);
    props.onClose();
  }

  const handleClose = () => {
    setPrinter(props.printer);
    //setDisabled(props.printer.type !== "Unknown");
    setChanged(false);
    props.onClose();
  }

  return (
      <Dialog fullScreen={fullScreen} onBackdropClick={handleClose} {...props}>
        <DialogTitle>{"Settings"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
              Select print settings to match printer at your station.
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Printer Type"
                value={printer.type}
                onChange={handlePrinterTypeChange}
              >
                <MenuItem key="Unknown" value="Unknown">
                  {"Unknown (Manual Config.)"}
                </MenuItem>
                {printerItems}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={disabled}
                fullWidth
                type="number"
                label="Resolution"
                helperText="300 dpi = 12 dpmm"
                InputProps={{endAdornment: <InputAdornment position="end">dpmm</InputAdornment>}}
                value={printer.dpmm}
                onChange={handleResolutionChange}
              />
            </Grid>

            <Grid item xs={4} />
            <Grid item xs={4}>
              <TextField
                disabled={disabled}
                fullWidth
                type="number"
                label="Top Margin"
                helperText="Also the bottom margin"
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>}}
                value={printer.marginTop}
                onChange={handleMarginTopChange}
              />
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <TextField
                disabled={disabled}
                fullWidth
                type="number"
                label="Left Margin"
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>}}
                value={printer.marginLeft}
                onChange={handleMarginLeftChange}
              />
            </Grid>
            <Grid item xs={4}>
              <div  align="center" style={{display: "flex", justifyContent: 'center', alignItems: 'center', width:"100%", height:"100%", border: "solid 1px black"}}>
                <Typography>Label</Typography>
              </div>
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={disabled}
                fullWidth
                type="number"
                label="Label Height"
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>}}
                value={printer.labelHeight}
                onChange={handleLabelHeightChange}
              />
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <TextField
                disabled={disabled}
                fullWidth
                type="number"
                label="Label Width"
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>}}
                value={printer.labelWidth}
                onChange={handleLabelWidthChange}
              />
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<SaveIcon/>} onClick={handleSave} disabled={!changed}>Save</Button>
          <Button startIcon={<CloseIcon/>} onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  );
}