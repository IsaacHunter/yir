// import PropTypes from "prop-types";
import React, { Component } from "react";
import { getStravaImg } from './../strava.js'
import { getGoodreadsImage } from './../goodreads.js'

export default class HomePage extends Component {
  state = {
    strava: {
      title: "Strava",
      name: "strava",
      controls: {
        type: "Run"
      }
    },
    goodreads: {
      title: "Goodreads",
      name: "goodreads"
    }
  };

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'

    fetch("http://localhost:4000/auth/strava/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error("failed to authenticate user");
    })
    .then(responseJson => {
      var strava = this.state.strava
      strava.authenticated = true;
      strava.user = responseJson.strava.user;
      this.setState({
        strava: strava
      });
    })
    .catch(error => {
      var strava = this.state.strava
      strava.authenticated = false
      this.setState({
        strava: strava,
        error: "Failed to authenticate user"
      });
    });

    fetch("http://localhost:4000/auth/goodreads/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error("failed to authenticate user");
    })
    .then(responseJson => {
      var goodreads = this.state.goodreads
      goodreads.authenticated = true
      goodreads.user = responseJson.goodreads.user
      goodreads.audiobooks = responseJson.goodreads.audiobooks
      goodreads.books = responseJson.goodreads.books
      goodreads.pages = responseJson.goodreads.pages
      this.setState({
        goodreads: goodreads
      });
    })
    .catch(error => {
      var goodreads = this.state.goodreads
      goodreads.authenticated = false
      this.setState({
        goodreads: goodreads,
        error: "Failed to authenticate user"
      });
    });
  }

  change = (event) => {
    var strava = this.state.strava
    strava.controls.type = event.target.value
    this.setState({
      strava: strava
    })
  }

  render() {
    const { strava, goodreads } = this.state;
    return (
      <div>
        <main role="main">
          <section class="jumbotron text-center">
            <div class="container">
              <h1>Year In Review</h1>
            </div>
          </section>
          <div class="album py-5 bg-light">
            <div class="container">
              <div class="row">

              <Item state={strava} getImg={state => getStravaImg(state)}>
                  <li class="list-group-item">
                  <select class="custom-select" onChange={this.change} value={strava.controls.type}>
                    <option value="Run" selected>Running</option>
                    <option value="Ride">Cycling</option>
                    <option value="Swim">Swimming</option>
                  </select>
                  </li>
                </Item>
                <Item state={goodreads} getImg={state => getGoodreadsImage(state)}>
                  
                </Item>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      img: null
    })
    this.getImg(props)
  }

  getImg = async (props) => {
    const img = await props.getImg(props.state)
    this.setState({
      img: img
    })
  }

  _handleConnectClick = (event) => {
    if (event.target.value) {
      // Authenticate using via passport api in the backend
      // Upon successful login, a cookie session will be stored in the client
      window.open("http://localhost:4000/auth/" + event.target.value, "_self");
    }
  };

  _handleDisconnectClick = (event) => {
    if (event.target.value) {
      // Logout using passport api
      window.open("http://localhost:4000/auth/" + event.target.value + "/logout", "_self");
    }
  };

  render() {
    const { state } = this.props;
    return (
      <div class="col-xl-3 col-md-4">
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
              <div class="btn-group" role="group" aria-label="Second group">
                <h3>{state.title}</h3>
              </div>
              <div class="btn-group" role="group" aria-label="Second group">
                {state.authenticated ? (
                  <button type="button" value={state.name} class="btn btn-primary" onClick={e => this._handleDisconnectClick(e)}>Disconnect</button>
                ): (
                  <button type="button" value={state.name} class="btn btn-primary" onClick={e => this._handleConnectClick(e)}>Connect</button>
                )}
              </div>
            </div>
          </div>
          <ul class="list-group list-group-flush">
            {!state.authenticated ? (
              <li class="list-group-item">
                Not connected
              </li>
            ) : (
              <div>
              <li class="list-group-item">
                Connected as: {state.user.displayName}
              </li>
              {this.props.children}
              <li class="list-group-item">
                {!this.state.img ? (
                  <div class="placeholder">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>    
                  </div>         
                ): (
                  <img style={{ width: "100%" }} src={this.state.img} />
                )}
              </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    );
  }
}