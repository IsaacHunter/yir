const goodreads = require('goodreads-api-node');
const { createCanvas } = require('canvas')

export async function getGoodreadsImage(state) {      
    const width = 540
    const height = 960
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)
    context.font = 'bold 30pt Roboto'
    context.textAlign = 'left'
    context.fillStyle = '#fff'
    context.fillText('Books', 50, 100)
    context.fillText('Audiobooks', 50, 250)
    context.fillText('Paper', 50, 400)
    context.fillText('Pages', 50, 550)
    
    context.textAlign = 'right'
    context.fillText(state.audiobooks, 490, 250)
    context.fillText(state.books - state.audiobooks, 490, 400)
    context.fillText(state.pages, 490, 550)
    
    var img = canvas.toDataURL()

    return img
}