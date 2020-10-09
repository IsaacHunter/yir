// import PropTypes from "prop-types";
import React, { Component } from "react";
import { getDistance } from './../strava.js'

export default class HomePage extends Component {
  state = {
    user: {},
    error: null,
    authenticated: false,
    distance: 0
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
        this.getDist(responseJson.user.token)
        this.setState({
          authenticated: true,
          user: responseJson.user
        });
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
      });
  }

  getDist = async (token) => {
    const distance = await getDistance(token)
    this.setState({
      distance: distance
    })
  }

  render() {
    const { authenticated } = this.state;
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
                <div class="col-md-4">
                  <div class="card mb-4 shadow-sm">
                    <div class="card-header">
                      <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group" role="group" aria-label="Second group">
                          <h3>Strava</h3>
                        </div>
                        <div class="btn-group" role="group" aria-label="Second group">
                          {authenticated ? (
                            <button type="button" class="btn btn-primary" onClick={this._handleDisconnectClick}>Disconnect</button>
                          ): (
                            <button type="button" class="btn btn-primary" onClick={this._handleConnectClick}>Connect</button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                    {!authenticated ? (
                      <p>Not connected</p>
                    ) : (
                      <div>
                        <p>Connected as: {this.state.user.displayName}</p>
                        {!this.state.distance ? (
                          <div class="placeholder">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>    
                          </div>         
                        ): (
                          <img style={{ width: "200px" }} src={this.state.distance} />
                        )}
                      </div>          
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
// <Header
// authenticated={authenticated}
// handleNotAuthenticated={this._handleNotAuthenticated}
// />
    );
  }

  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };

  _handleConnectClick = () => {
    // Authenticate using via passport api in the backend
    // Upon successful login, a cookie session will be stored in the client
    window.open("http://localhost:4000/auth/strava", "_self");
  };

  _handleDisconnectClick = () => {
    // Logout using passport api
    // Set authenticated state to false in the HomePage
    window.open("http://localhost:4000/auth/strava/logout", "_self");
    this.props.handleNotAuthenticated();
  };
}
