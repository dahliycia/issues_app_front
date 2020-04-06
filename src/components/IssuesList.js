import React from 'react';
import { Grid, Typography, Button, Dialog, DialogTitle, Toolbar } from '@material-ui/core';

import connect from '../connect';
import Issue from './Issue'
import AddIssue from './AddIssue'

const LIMIT = 4;


class IssuesList extends React.Component {
  state = {
    data: [],
    total: 0,
    error: false,
    offset: 0,
    newIssueOpened: false
  }

  getData = async () => {
    const { offset } = this.state;
    const data = await connect.get(`/issues?offset=${offset}&limit=${LIMIT}`)
    if (data.error) this.setState({error: true})
    else this.setState({data: data.data, total: data.total})
  }

  async componentDidMount() {
    await this.getData()
  }
  
  changePage = (direction) => async () => {
    // NOTE: would be nice to change URL on this
    await this.setState({offset: this.state.offset + LIMIT*direction})
    await this.getData()
  }

  render(){
    const { error, data, offset, total, newIssueOpened } = this.state;
    if (error) {
      return <Typography variant="overline">An error occured. Please check the url and try again</Typography>
    } else
    return (
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Grid container justify="flex-end">
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => this.setState({newIssueOpened: true})}
              >
                NEW ISSUE
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1} >
            {data.map((issue) => (
              <Grid item xs={6} key={issue.id}>
                <Issue id={issue.id} data={issue} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Toolbar style={{bottom: 0}}>
          <Grid container spacing={1} justify="center">
            <Grid item>
              <Button onClick={this.changePage(-1)} disabled={offset === 0}>{"< PREVIOUS"}</Button>
            </Grid>
            <Grid item>
              <Button onClick={this.changePage(1)} disabled={offset+data.length === total}>{"NEXT >"}</Button>
            </Grid>
          </Grid>
          </Toolbar>
        </Grid>
        <Dialog onClose={() => this.setState({newIssueOpened: false})} open={newIssueOpened}>
          <DialogTitle><AddIssue forceUpdate={this.getData}/></DialogTitle>
        </Dialog>
      </Grid>
    )
  }
}

export default IssuesList;