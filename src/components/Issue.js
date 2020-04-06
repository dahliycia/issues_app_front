import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid, Typography, Chip, Button, ExpansionPanel, ExpansionPanelSummary, 
  ExpansionPanelDetails, Divider, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

import connect from '../connect';

const COLOR_STATE_MAP = {
  'open': 'orange',
  'pending': 'lightblue',
  'closed': 'lightgreen'
}

const STATES = Object.keys(COLOR_STATE_MAP)

const styles = ({
  root: {
    padding: "20px"
  },
  textBox: {
    padding: "20px"
  },
  commentBox: {
    padding: "20px",
    backgroundColor: "lightyellow"
  },
  divider: {"marginTop": "10px"}
})


class IssueHeader extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }

  render() {
    const { id, title, state } = this.props;
    return (
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <Link 
                to={{ pathname: `/${id}` }}
                style={{ textDecoration: 'none', color: "black"}}
              >
                <Button style={{fontSize: "20px"}}>#{id}</Button>
              </Link>
            </Grid>
            <Grid item><Typography variant="h4">{title}</Typography></Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Chip size="small" style={{backgroundColor: COLOR_STATE_MAP[state]}} label={state} />
        </Grid>
      </Grid>
    )
  }
}


class IssueStateUpdater extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    forceUpdate: PropTypes.func.isRequired
  }

  state = {
    author: undefined,
    comment: undefined,
    result: undefined,
    success: undefined
  }

  changeState = async () => {
    const { state, id } = this.props;
    const { author, comment } = this.state;
    if (!author || !comment) {
      this.setState({ author: author || '', comment: comment || ''})
    } else {
      const body = {
        state: state,
        comment: { author: author, text: comment }
      }
      const response = await connect.post(`/issues/${id}/change_state`, body)
      if (response.error) {
        this.setState({result: 'Error updating issue: ' + response.error, success: false})
      } else {
        this.setState({result: 'Successfully updated state to: ' + response.state, success: true})
        this.props.forceUpdate()
      }

    }
  }

  authorInput = (event) => {
    this.setState({author: event.target.value})
  }

  commentInput = (event) => {
    this.setState({comment: event.target.value})
  }

  render() {
    const { state } = this.props;
    const { result, success } = this.state;
    return (
      <Grid item>
      <ExpansionPanel variant="outlined">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="button">Update issue status</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {result ? (
            <Grid container justify="center" spacing={2} alignItems="center" style={{backgroundColor: success? "lightgreen" : "lightpink"}}>
              <Grid item>
                <Typography>{result}</Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container justify="space-between" spacing={2}>
              <Grid item>
                <TextField 
                  error={this.state.author === ''} 
                  required 
                  id="author"  
                  onInput={this.authorInput}
                  helperText="Author"
                  />
              </Grid>
              <Grid item xs>
                <TextField 
                  error={this.state.comment === ''}
                  required 
                  fullWidth
                  id="comment" 
                  helperText="Comment"
                  onInput={this.commentInput} 
                  />
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={this.changeState}>Send to {state}</Button>
              </Grid>
            </Grid>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
    )
  }
}

class Issue extends React.Component {
  state = {
    data: {}
  }

  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object
  }

  getID = () =>  this.props.id || this.props.match.params.id;

  getData = async () => {
    const data = await connect.get(`/issues/${this.getID()}`)
    if (data.error) this.setState({error: true})
    else this.setState({data: data})
  }

  async componentDidMount() {
    if (!this.props.data) await this.getData()
    else this.setState({data: this.props.data})
  }

  getNextState() {
    const currentState = this.state.data.state
    const nextIndex = STATES.indexOf(currentState)+1;
    if (nextIndex < STATES.length)
      return STATES[nextIndex];
    else
      return undefined;
  }


  render(){
    const id = this.getID();
    const { classes } = this.props;
    const { data, error } = this.state;
    const nextState = this.getNextState();
    if (error) {
      return <Typography variant="overline">An error occured. Please check the url and try again</Typography>
    } else if (Object.keys(data).length > 0)
    return (
      <Paper variant="outlined">
        <div className={classes.root}>
          
        <Grid container spacing={2} direction="column">
          <Grid item>
            <IssueHeader id={id} state={data.state} title={data.title}/>
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <Typography variant="overline">
                  Created by: {data.submitter}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="overline">
                  Description:
                </Typography>
                <Paper variant="outlined" className={classes.textBox}>
                  <Typography variant="body2">
                    {data.description}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Typography variant="overline">
                  Comments:
                </Typography>
                {(data.comments || []).length > 0 && (
                  <Paper variant="outlined" className={classes.commentBox}>
                    <Grid container spacing={1} direction="column">
                      {(data.comments || []).map((comment, index) => (
                        <Grid item key={`${index}${id}`}>
                          <Typography variant="body2">
                          by {comment.author} : {comment.text}
                          </Typography>
                          {data.comments.indexOf(comment) + 1 !== data.comments.length && <Divider className={classes.divider} />}
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}
              </Grid>
              {nextState && (
                <IssueStateUpdater state={nextState} id={id} forceUpdate={this.getData}/>
              )}
            </Grid>
          </Grid>
        </Grid>
        </div>
      </Paper>
    )
    else return null
  }
}

export default withStyles(styles)(Issue);