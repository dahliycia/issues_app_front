import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid, Typography, Button, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import connect from '../connect';

const styles = ({
  paper: {
    // minWidth: "640px"
  },
  root: {
    padding: "20px",
  },
  textBoxLong: {
    width: "500px"
  },
  commentBox: {
    padding: "20px",
    backgroundColor: "lightyellow"
  },
  divider: {"marginTop": "10px"}
})


class AddIssue extends React.Component {
  static propTypes = {
    forceUpdate: PropTypes.func.isRequired
  }

  state = {
    submitter: undefined,
    description: undefined,
    title: undefined,
    result: undefined,
    success: undefined
  }

  titleInput = (event) => {
    this.setState({title: event.target.value})
  }

  submitterInput = (event) => {
    this.setState({submitter: event.target.value})
  }

  descriptionInput = (event) => {
    this.setState({description: event.target.value})
  }

  submit = async () => {
    const { submitter, title, description } = this.state;
    if (!submitter || !title || !description) {
      this.setState({ submitter: submitter || '', title: title || '', description: description || ''})
    } else {
      const body = {
        submitter: submitter,
        title: title,
        description: description
      }
      const response = await connect.post(`/issues/add`, body)
      if (response.error) {
        this.setState({result: 'Error creating issue: ' + response.error, success: false})
      } else {
        this.setState({result: 'Successfully created issue: ' + response.id, success: true})
        this.props.forceUpdate()
      }
    }
  }

  render(){
    const { classes } = this.props;
    const { result, success } = this.state;
    if (result) {
      return (
        <Paper variant="outlined" className={classes.paper}>
          <div className={classes.root}>
            <Grid container justify="center" spacing={2} alignItems="center" style={{backgroundColor: success? "lightgreen" : "lightpink"}}>
              <Grid item>
                <Typography>{result}</Typography>
              </Grid>
            </Grid>
          </div>
        </Paper>
      )
    } else
    return (
      <Paper variant="outlined" className={classes.paper}>
        <div className={classes.root}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h4">New Issue</Typography>
          </Grid>
          <Grid item>
          <Grid container justify="space-between" spacing={2} direction="column">
              <Grid item>
                <TextField 
                  error={this.state.title === ''} 
                  required 
                  id="title"  
                  onInput={this.titleInput}
                  helperText="Title"
                  />
              </Grid>
              <Grid item xs>
                <TextField 
                  error={this.state.submitter === ''}
                  required 
                  id="submitter" 
                  helperText="Submited by"
                  onInput={this.submitterInput} 
                  />
              </Grid>
              <Grid item xs>
                <TextField 
                  className={classes.textBoxLong}
                  error={this.state.description === ''}
                  required 
                  multiline
                  rows="4"
                  id="description" 
                  helperText="Please describe the issue"
                  onInput={this.descriptionInput} 
                  />
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={this.submit}>Submit issue</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(AddIssue);