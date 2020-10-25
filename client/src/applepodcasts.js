const { createCanvas } = require('canvas')

export async function getApplepodcastsImage(state) {      
    if (!state.user) {
        return null
    }

    var first = {
        key: "",
        count: 0
    }
    var second = {
        key: "",
        count: 0
    }
    var third = {
        key: "",
        count: 0
    }
    var count = 0

    Object.keys(state.user.genres).map(function(key, index) {
        if (key === "Podcasts") {
            count = state.user.genres[key]
        } else if (state.user.genres[key] > first.count) {
            third.key = second.key
            third.count = second.count

            second.key = first.key
            second.count = first.count

            first.key = key
            first.count = state.user.genres[key]
        } else if (state.user.genres[key] > second.count) {
            third.key = second.key
            third.count = second.count

            second.key = key
            second.count = state.user.genres[key]
        } else if (state.user.genres[key] > third.count) {
            third.key = key
            third.count = state.user.genres[key]
        }
    })

    const width = 540
    const height = 960
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)
    context.font = 'bold 30pt Roboto'
    context.textAlign = 'left'
    context.fillStyle = '#fff'
    context.fillText('Podcasts', 50, 100)
    context.fillText(count + ' podcasts', 50, 250)
    context.fillText('Top Genres', 50, 400)
    context.font = 'bold 20pt Roboto'
    context.fillText('in your library', 50, 280)
    context.fillText(first.key, 50, 450)
    context.fillText(second.key, 50, 480)
    context.fillText(third.key, 50, 510)
    
    var img = canvas.toDataURL()

    return [img]
}