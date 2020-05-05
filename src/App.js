import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import { withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import SettingsIcon from '@material-ui/icons/Settings';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import ControlPointDuplicateIcon from '@material-ui/icons/ControlPointDuplicate';

import LabelMaker from './LabelMaker';
import BulkMaker from './BulkMaker';
import SettingsDialog from './SettingsDialog';

const config = require('./config.json');

const drawerWidth = 240;

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
                },
                drawer: {
                  width: drawerWidth,
                  flexShrink: 0,
                },
                drawerPaper: {
                  width: drawerWidth,
                },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.handlePrint = this.handlePrint.bind(this);
    this.handlePrintDone = this.handlePrintDone.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleSettingsChanged = this.handleSettingsChanged.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);

    const savedPrinter = window.localStorage.getItem('printer');

    this.state = {
      printer: savedPrinter ? JSON.parse(savedPrinter) : config.printers["B_TD2130N"],
      settingsOpen: false,
      drawerOpen: false,
    };
  }

  handleSettingsToggle() {
    this.setState({settingsOpen: !this.state.settingsOpen});
  }

  handleSettingsChanged(printer) {
    window.localStorage.setItem('printer', JSON.stringify(printer));
    this.setState({printer: printer});
    console.log(printer);
  }

  handleDrawerOpen() {
    this.setState({drawerOpen: true});
  }

  handleDrawerClose() {
    this.setState({drawerOpen: false});
  }

  handlePrint() {
    this.setState({print: true});
  }

  handlePrintDone() {
    this.setState({print: false});
  }

  render()
  {
    const {classes} = this.props;
    
    return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, this.state.drawerOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Label Maker
            </Typography>
            <Button color="inherit" startIcon={<PrintIcon />} onClick={this.handlePrint}>Print</Button>
            <IconButton color="inherit" onClick={this.handleSettingsToggle}><SettingsIcon/></IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          className={classes.drawer}
          anchor="left"
          open={this.state.drawerOpen}
          onClose={this.handleDrawerClose}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><ControlPointIcon /></ListItemIcon>
            <ListItemText primary="Single" />
          </ListItem>
          <ListItem button component={Link} to="/bulk">
            <ListItemIcon><ControlPointDuplicateIcon /></ListItemIcon>
            <ListItemText primary="Bulk" />
          </ListItem>
        </List>
      </Drawer>


        <Container className={classes.container} maxWidth="md">
          <Switch>
            <Route path='/bulk'>
              <BulkMaker onPrint={this.handlePrintDone} {...this.state}/>
            </Route>
            <Route path='/'>
              <LabelMaker onPrint={this.handlePrintDone} {...this.state} />
            </Route>
          </Switch>
        </Container>
        <SettingsDialog printer={this.state.printer} printers={config.printers} open={this.state.settingsOpen} onClose={this.handleSettingsToggle} onSave={this.handleSettingsChanged}/>
      </div>
    </Router>
  );}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(App);
