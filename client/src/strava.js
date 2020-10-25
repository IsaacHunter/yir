const { createCanvas } = require('canvas')

export async function getStravaImage(state) {

    if (!state.user || !state.user.activities) {
        return null
    }

    const width = 540
    const height = 960
    var imgs = []

    for (const key in state.user.activities) {

        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        context.fillStyle = '#000'
        context.fillRect(0, 0, width, height)
        context.font = 'bold 30pt Roboto'
        context.textAlign = 'left'
        context.fillStyle = '#fff'
        
        var title
        switch(key) {
            case 'Ride':
                title = 'Cycling';
                break;
            case 'Swim':
                title = 'Swimming';
                break;
            default:
                title = 'Running';
        }
    
    
        context.fillText(title, 50, 100)
        context.fillText('Distance', 50, 250)
        context.fillText('Time', 50, 400)
        context.fillText('Elev Gain', 50, 550)
        context.fillText(key + 's', 50, 700)
    
        context.textAlign = 'right'
        context.fillText((state.user.activities[key].distance/1000).toFixed(1) + 'km', 490, 250)
    
        var timeString = (state.user.activities[key].time / 3600).toFixed(0) + 'h '
        timeString = timeString + ((state.user.activities[key].time % 3600) / 60).toFixed(0) + 'm '
        timeString = timeString + (state.user.activities[key].time % 60).toFixed(0) + 's'
        context.fillText(timeString, 490, 400)
        
        context.fillText(state.user.activities[key].gain.toFixed(1) + 'm', 490, 550)
        context.fillText(state.user.activities[key].count, 490, 700)
        
        imgs.push(canvas.toDataURL())
    }
    
    return imgs
}