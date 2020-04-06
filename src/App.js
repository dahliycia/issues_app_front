import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { AppBar, Grid, Typography, MuiThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core'

import Logo from './images/cracker_logo.png'

import './App.css';
import IssuesList from './components/IssuesList';
import Issue from './components/Issue';

let theme = {
  palette: {
    type: 'light',
    primary: {
      main: '#FFFFFF'
    },
    secondary: {
      main: '#ff9500'
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
                      <Link to={{ pathname: `/` }}>
                        <img src={Logo} height={100} alt="oCTO+" />
                      </Link>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">Cracker - Issue Tracker</Typography>
                    </Grid>

                  </Grid>
                </AppBar>
                <div style={{ padding: "10px", height: "100%" }}>
                  <Switch>
                    <Route exact path="/" component={IssuesList} />  
                    <Route exact path="/:id" component={Issue} />  
                  </Switch>
                </div>
              </CssBaseline>
            </Router>
          </MuiThemeProvider>
    );
  }
}

export default App;
