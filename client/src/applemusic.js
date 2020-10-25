const { createCanvas } = require('canvas')

export async function getApplemusicImage(state) {      
    if (!state.user) {
        return null
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
    context.fillText('Music', 50, 100)
    context.fillText(state.user.views["top-albums"].data[0].relationships.album.data[0].attributes.name, 50, 290)
    context.fillText(state.user.views["top-artists"].data[0].relationships.artist.data[0].attributes.name, 50, 440)
    context.fillText(state.user.views["top-songs"].data[0].relationships.song.data[0].attributes.name, 50, 590)
    context.font = 'bold 20pt Roboto'
    context.fillText('Top Album', 50, 250)
    context.fillText('Top Artist', 50, 400)
    context.fillText('Top Song', 50, 550)
    context.fillText(state.user.views["top-albums"].data[0].attributes.playCount + " plays", 50, 320)
    context.fillText(state.user.views["top-artists"].data[0].attributes.playCount + " plays", 50, 470)
    context.fillText(state.user.views["top-songs"].data[0].attributes.playCount + " plays", 50, 620)
    
    context.textAlign = 'right'
    // context.fillText(state.user.audiobooks, 490, 250)
    // context.fillText(state.user.books.length - state.user.audiobooks, 490, 400)
    // context.fillText(state.user.pages, 490, 550)
    // context.fillText(state.user.books[state.controls.favBook].slice(0,10), 490, 700)

    var img = canvas.toDataURL()

    return [img]
}