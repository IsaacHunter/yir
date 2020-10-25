import { getImgFromURL } from "./utilities.js"
const { createCanvas } = require('canvas')

export async function getGoodreadsImage(state) {      
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
    context.fillText('Books', 50, 100)
    context.fillText('Audiobooks', 50, 250)
    context.fillText('Paper', 50, 400)
    context.fillText('Pages', 50, 550)
    context.fillText('Favourite', 50, 700)
    
    context.textAlign = 'right'
    context.fillText(state.user.audiobooks, 490, 250)
    context.fillText(state.user.books.length - state.user.audiobooks, 490, 400)
    context.fillText(state.user.pages, 490, 550)
    context.fillText(state.user.books[state.controls.favBook].slice(0,10), 490, 700)

    let fav = await getImgFromURL(state.user.imgs[state.controls.favBook])
    context.drawImage(fav, 290, 650, 200, fav.naturalHeight*200/fav.naturalWidth)
    
    var img = canvas.toDataURL()

    return [img]
}
