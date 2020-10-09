const Strava = require('strava-v3');
const keys = require("./keys");
const { createCanvas } = require('canvas')

export async function getDistance(token) {
    Strava.config({
        "access_token"  : keys.strava.access_token,
        "client_id"     : keys.strava.clientID,
        "client_secret" : keys.strava.clientSecret,
        "redirect_uri"  : 'auth/strava/redirect',
    });
    var loop = true
    var page = 1

    var distance = 0
    var time = 0
    var runs = 0
    var gain = 0
    while (loop) {
        const payload = await Strava.athlete.listActivities({'access_token':token, page: page});
        page ++
        for (const activity of payload) {
            if (activity.start_date_local.slice(0,4) === "2020") {
                if (activity.type === "Run") {
                    distance += activity.distance
                    time += activity.moving_time
                    gain += activity.total_elevation_gain
                    runs ++
                } else {
                    console.log(activity.type)
                }
            } else {
                loop = false
                break
            }
        }
    }

    const width = 540
    const height = 960
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)
    context.font = 'bold 30pt Roboto'
    context.textAlign = 'left'
    context.fillStyle = '#fff'
    context.fillText('Running', 50, 100)
    context.fillText('Distance', 50, 250)
    context.fillText('Time', 50, 400)
    context.fillText('Elev Gain', 50, 550)
    context.fillText('Runs', 50, 700)

    context.textAlign = 'right'
    context.fillText((distance/1000).toFixed(1) + 'km', 490, 250)

    var timeString = (time / 3600).toFixed(0) + 'h '
    timeString = timeString + ((time % 3600) / 60).toFixed(0) + 'm '
    timeString = timeString + (time % 60).toFixed(0) + 's'
    context.fillText(timeString, 490, 400)
    
    context.fillText(gain.toFixed(1) + 'm', 490, 550)
    context.fillText(runs, 490, 700)
    
    var img = canvas.toDataURL()

    // return distance / 1000
    return img
}