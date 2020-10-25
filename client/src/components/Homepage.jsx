import React, { Component } from "react";
import { getStravaImage } from './../strava.js'
import { getGoodreadsImage } from './../goodreads.js'
import { getApplemusicImage } from './../applemusic.js'
import { getApplepodcastsImage } from './../applepodcasts.js'
import { getYouversionImage } from './../youversion.js'
import { isArguments, isEqual } from 'lodash';


export default class HomePage extends Component {
  state = {
    strava: {
      title: "Strava",
      name: "strava",
      img: "strava.png",
      controls: {
        type: "Run"
      }
    },
    goodreads: {
      title: "Goodreads",
      name: "goodreads",
      img: "goodreads.jpg",
      controls: {
        favBook: 0
      }
    },
    applemusic: {
      title: "Apple Music",
      name: "applemusic",
      img: "apple-music.png",
      controls: {
        type:"Music"
      } 
    },
    applepodcasts: {
      title: "Apple Podcasts",
      name: "applepodcasts",
      img: "apple-podcasts.jpg",
      controls: {
        type:"Music"
      } 
    },
    youversion: {
      title: "Youversion Bible",
      name: "youversion",
      img: "youversion.png",
      controls: {
      }
    }
  };

  componentDidMount() {

    // const script = document.createElement("script");
    // script.src = "https://js-cdn.music.apple.com/musickit/v2/amp/musickit.js";
    // script.async = true;
    // document.body.appendChild(script);
    // document.addEventListener('musickitloaded', (e) => {
    //   window.MusicKit.configure({
    //     developerToken: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlgyTVc4UVlXQzUifQ.eyJpYXQiOjE2MDI5OTIxMDIsImV4cCI6MTYwMzE2NDkwMiwiaXNzIjoiUU43UkVEQ1VEMyJ9.ytpsdtlY7rskfosDUQuUjYRZstgXUsiP3NA8ub9KrMBOYEjKiPE0OrVhV4z4WU0HNxkmP03JZXpgIcQ9ZwqmvA",
    //     musicUserToken: "AhHShJTpAxPPlg3HaBnisvvy62npeOyTkXpHjITsA+iq+OSnZgKsAeF0vaaEbE0eU3MxdXBxMOg4ePLBQWEF5UN7Nxgvy9H3JOi3NROKK2+N+d20Sr1GekQJnD43NPzmKILbXkkbYPfWTvIpMd4ArKz0RVTOOyMjovpoKngTq0QeoEuMiL8+M9S13xs5JBxEtslSnMuqzdhcs9WPcsryqvYnTOOdACFbeMRN4+G15AnTZmMFIw==",
    //     app: {
    //       name: 'AppleMusicKitExample',
    //       build: '1978.4.1'
    //     }
    //   }).then(function(music) {
    //     // music.authorize().then(function() {
    //       // music.api.library.podcasts()
    //       music.api._podcastsAPI.podcasts()
    //       .then(function(cloudAlbums) {
    //         // user's cloudAlbums
    //         console.log(cloudAlbums);
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   });
    // });


    // Fetch does not send cookies. So you should add credentials: 'include'
    for (var key in this.state) {
      const thekey = key
      fetch("http://localhost:4000/auth/"+thekey+"/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            [thekey]: {
              ...this.state[thekey],
              authenticated: 1
            }
          });
          fetch("http://localhost:4000/auth/"+thekey+"/data", {
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
            var app = this.state[responseJson.data.provider]
            app.authenticated = 2;
            app.user = responseJson.data;
            this.setState({
              [responseJson.data.provider]: app
            });
          })
          .catch(error => {
            //TODO: Proper callbacks instead of getting app type from responseJson
    
            // var app = this.state[key]
            // app.authenticated = false;
            // app.error = "Failed to authenticate user";
            // this.setState({
            //   [key]: app
            // });
          });
        }
      })
    }
  }

  stravaSelectType = (event) => {
    var strava = this.state.strava
    strava.controls.type = event.target.value
    this.setState({
      strava: strava
    })
  }

  goodreadsSelectFav = (event) => {
    var goodreads = this.state.goodreads
    goodreads.controls.favBook = event.target.value
    this.setState({
      goodreads: goodreads
    })
  }

  render() {
    const { strava, goodreads, applemusic, applepodcasts, youversion } = this.state;
    return (
      <div>
        <main role="main">
          <section className="jumbotron text-center">
            <div className="container">
              <h1>Year In Review</h1>
            </div>
          </section>
          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row">
                {youversion.authenticated &&
                  <Item state={youversion} getImg={state => getYouversionImage(state)}></Item>
                }

                {applemusic.authenticated && 
                  <Item state={applemusic} getImg={state => getApplemusicImage(state)}>
                  </Item>
                }

                {applepodcasts.authenticated && 
                  <Item state={applepodcasts} getImg={state => getApplepodcastsImage(state)}>
                  </Item>
                }

                {strava.authenticated && 
                  <Item state={strava} getImg={state => getStravaImage(state)}>
                  </Item>
                }

                {goodreads.authenticated && 
                  <Item state={goodreads} getImg={state => getGoodreadsImage(state)}>
                    {goodreads.user && goodreads.user.books &&
                      <li className="list-group-item">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">Fav:</span>
                          </div>
                          <select className="custom-select" onChange={this.goodreadsSelectFav} value={goodreads.controls.favBook}>                  
                            {goodreads.user.books.map(function(object, i){
                                return <option value={i}>{object}</option>
                            })}
                          </select>
                        </div>
                      </li>
                    }
                  </Item>
                }
                <div className="col-sm">
                  <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-primary text-white"><h5>Connect an App</h5></div>
                    <div className="card-body app-chooser">
                      {Object.keys(this.state).map(function(key, index) {
                        return(
                          <AppButton key={key} name={key} img={this.state[key].img} />
                        )
                      }.bind(this))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

class AppButton extends React.Component {
  _handleConnectClick = (key) => {
    if (key) {
      // if (key == "youversion") {
        // window.open("http://localhost:3000/youversion-login", "_self");
      // } else {
        // Authenticate using via passport api in the backend
        // Upon successful login, a cookie session will be stored in the client
        window.open("http://localhost:4000/auth/" + key, "_self");
      // }
    }
  };

  render() { 
    return (
      <div className="app" onClick={e => this._handleConnectClick(this.props.name)}>
        <img className="img-fluid" alt={this.props.name + " logo"} src={require("./../images/"+this.props.img)} />
      </div>
    )
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: null,
      controls: {},
      authenticated: 1,
      imgIndex: 0
    };
  }
  
  componentDidMount() {
    if (this.props) {
      this.setState({
        imgs: null,
        controls: { ...this.props.state.controls },
        authenticated: this.props.state.authenticated
      }, () => {
        this.getImg(this.props)
      })
    }
  }

  componentDidUpdate(props) {
    if (!isEqual(props.state.controls, this.state.controls) || !isEqual(props.state.authenticated, this.state.authenticated)) {
      this.setState({
        imgs: null,
        controls: { ...props.state.controls },
        authenticated: this.props.state.authenticated
      }, () => {
        this.getImg(props)
      })
    }
  }

  getImg = async (props) => {
    const imgs = await props.getImg(props.state)
    this.setState({
      imgs: imgs
    })
  }

  _handleDisconnectClick = (event) => {
    if (event.target.value) {
      // Logout using passport api
      window.open("http://localhost:4000/auth/" + event.target.value + "/logout", "_self");
    }
  };

  _handleNext = () => {
    var i = this.state.imgIndex + 1
    if (i >= this.state.imgs.length) {
      i = 0
    }
    this.setState({imgIndex:i})
  }

  render() {
    const { state } = this.props;
    return (
      <div className="col-lg-4 col-sm-6">
        <div className="card mb-4 shadow-sm">
          <div className="card-header">
            <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group" role="group" aria-label="Second group">
                <h5>{state.title}</h5>
              </div>
              <div className="btn-group" role="group" aria-label="Second group">
                {/* {state.authenticated ? (
                  <button type="button" value={state.name} className="btn btn-sm btn-primary" onClick={e => this._handleDisconnectClick(e)}>Disconnect</button>
                ): (
                  <button type="button" value={state.name} className="btn btn-sm btn-primary" onClick={e => this._handleConnectClick(e)}>Connect</button> 
                )*/}
              </div>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            {!state.authenticated ? (
              <li className="list-group-item">
                Not connected
              </li>
            ) : (
              <div>
              {/* <li className="list-group-item">
                Connected as: {state.user.displayName}
              </li> */}
              {this.props.children}
              <li className="list-group-item">
                {!this.state.imgs ? (
                  <div className="placeholder">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>    
                  </div>         
                ): (
                  <div>
                    <div className="scrubber">
                      { this.state.imgs.map((img, index) =>
                        <ScrubberSvg width={100/this.state.imgs.length} selected={this.state.imgIndex === index} />
                      )}
                    </div>
                    <img alt={state.name} style={{ width: "100%" }} src={this.state.imgs[this.state.imgIndex]} onClick={this._handleNext} />
                  </div>
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

function ScrubberSvg(props) {
  return (
    <svg width={props.width+"%"} height="4">
      <rect width="100%" height="100%" x="0" y="0" fill={props.selected ? "#333333" : "#dddddd"} rx="2" />
    </svg>
  );
}