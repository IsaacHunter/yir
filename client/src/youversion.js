import { getImgFromURL } from "./utilities.js"
const { createCanvas } = require('canvas')

export async function getYouversionImage(state) {      
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
    context.fillText('Bible', 50, 100)
    context.fillText('Plans:', 50, 250)
    context.textAlign = 'right'
    context.fillText(state.user.plans.length, 490, 250)
    context.textAlign = 'left'
    context.fillText(state.user.longestPlan.name.default, 50, 450)
    context.font = 'bold 20pt Roboto'
    context.fillText('Longest Plan', 50, 410)
    context.fillText("Length: " + state.user.longestPlan.total_days + " days", 50, 485)
    
    var url = state.user.longestPlan.images[0].url
    if (url.slice(0,31) === "//imageproxy.youversionapi.com/") {
        url = "http:" + url
    }
    let planImg = await getImgFromURL(url)
    context.drawImage(planImg, 50, 500, 200, planImg.naturalHeight*200/planImg.naturalWidth)
    
    var img = canvas.toDataURL()

    return [img]
}