import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AppBar, Grid, Tab, Tabs, Typography, MuiThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core'

import Logo from './images/cracker_logo.png'

import './App.css';
//import Thoughts from './components/Thoughts';

let theme = {
  palette: {
    type: 'light',
    primary: {
      main: '#FFFFFF'
    },
    secondary: {
      main: '#4EA6E1'
    }
  },
}


class App extends React.Component {
  render () {
    return (
          <MuiThemeProvider theme={createMuiTheme(theme)} >
            <Router>
              <CssBaseline>
                <AppBar position="static">
                  <Grid container spacing={4} alignItems="center" style={{padding: "10px"}}>
                    <Grid item>
                      <img src={Logo} height={100} alt="oCTO+" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">Cracker - Issue Tracker</Typography>
                    </Grid>

                  </Grid>
                </AppBar>
    {/*<Route exact path="/" component={Thoughts} />*/}
              </CssBaseline>
            </Router>
          </MuiThemeProvider>
    );
  }
}

export default App;
