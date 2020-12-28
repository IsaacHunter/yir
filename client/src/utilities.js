const { createCanvas } = require('canvas')

export const getImgFromURL = (source) => new Promise( resolve => {
    let img = new Image();
    img.onload = function() {
        resolve(img)
    };
    img.crossOrigin="anonymous" 
    img.src = source
})

export function nicestr(number) {
    return number.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export async function getSummaryImage(details) {
    const width = 1080
    const height = 1920
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = details.colors.primary
    context.fillRect(0, 0, width, height)
    
    // Draw the white bkg
    context.fillStyle = '#fff'
    context.roundRect(108, 192, 864, 1536, {upperLeft:18,upperRight:18,lowerLeft:18,lowerRight:18}, true, false);

    // Draw my year in  
    context.fillStyle = "#433f3f"
    context.font = 'bold 32px Futura'
    context.textAlign = 'center'
    context.fillText("My year in", 540, 286)

    let logo = await getImgFromURL(details.logo)
    context.drawImage(logo, 540-logo.naturalWidth*22/logo.naturalHeight, 310, logo.naturalWidth*44/logo.naturalHeight, 44)

    // Draw the waves
    context.fillStyle = details.colors.secondaryLight
    var p = new Path2D('M972,949.5c-38.4,19.4-75.1,42.4-109.3,68.5c-38.5,29.4-74.1,62.9-115.4,88.1c-41.3,25.3-90.4,42.1-138.1,33.6c-60.3-10.7-115.8-60.5-175.1-45.4c-65.7,16.7-94.2,104-160,120.2c-55.7,13.7-109.1-30.1-166-35.7V1619h864V949.5z');
    context.fill(p);

    // Draw the bottom bar
    context.fillStyle = details.colors.secondary
    context.roundRect(108, 1609, 864, 119, {lowerLeft:18,lowerRight:18}, true, false);
    // Bottom bar text
    context.fillStyle = details.colors.primary
    context.font = 'bold 38px Futura'
    context.fillText("MYYEARINREVIEW.COM", 540, 1686)

    // Big data
    context.font = 'bold 180px Futura'
    context.fillText(details.title.middle, 540, 827)

    // Draw the running man
    var my_gradient=context.createLinearGradient(108, 0, 864, 0);
    my_gradient.addColorStop(0, details.colors.secondary);
    my_gradient.addColorStop(1, details.colors.secondaryLight);
    context.fillStyle = my_gradient;
    context.fill(details.icon);

    context.fillStyle = details.colors.primary
    context.font = 'bold 70px Futura'
    for (var i in details.title.top) {
        context.fillText(details.title.top[i], 540, 586-(84*(details.title.top.length-i-1)))
    }
    for (var i in details.title.bottom) {
        context.fillText(details.title.bottom[i], 540, 968+(84*i))
    }

    var moreStatsPositions = []
    switch (details.moreStats.length) {
        case 4:
            moreStatsPositions = [{x: 346, y: 1338}, {x: 1080-346, y: 1338}, {x: 346, y: 1476}, {x: 1080-346, y: 1476}]
            break;
        case 3:
            moreStatsPositions = [{x: 346, y: 1338}, {x: 1080-346, y: 1338}, {x: 540, y: 1476}]
            break;
        case 2:
            moreStatsPositions = [{x: 346, y: 1407}, {x: 1080-346, y: 1407}]
            break;
        default:
            moreStatsPositions = [{x: 540, y: 1407}]
            break;
    }

    for (var i in details.moreStats) {
        context.font = 'bold 25px Futura'
        context.fillText(details.moreStats[i].title, moreStatsPositions[i].x, moreStatsPositions[i].y)
        context.font = 'bold 50px Futura'
        context.fillText(details.moreStats[i].value, moreStatsPositions[i].x, moreStatsPositions[i].y + 53)
    }

    return canvas.toDataURL()
}

export async function getGalleryImage(details) {
    const width = 1080
    const height = 1920
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = details.colors.primary
    context.fillRect(0, 0, width, height)
    
    // Draw the white bkg
    context.fillStyle = '#fff'
    context.roundRect(108, 192, 864, 1536, {upperLeft:18,upperRight:18,lowerLeft:18,lowerRight:18}, true, false);

    // Draw my year in  
    context.fillStyle = "#433f3f"
    context.font = 'bold 32px Futura'
    context.textAlign = 'center'
    context.fillText("My year in", 540, 286)

    let logo = await getImgFromURL(details.logo)
    context.drawImage(logo, 540-logo.naturalWidth*22/logo.naturalHeight, 310, logo.naturalWidth*44/logo.naturalHeight, 44)

    // Draw the bottom bar
    context.fillStyle = details.colors.secondary
    context.roundRect(108, 1609, 864, 119, {lowerLeft:18,lowerRight:18}, true, false);
    // Bottom bar text
    context.fillStyle = details.colors.primary
    context.font = 'bold 38px Futura'
    context.fillText("MYYEARINREVIEW.COM", 540, 1686)

    // Draw the secondary colour background
    context.fillStyle = details.colors.secondaryLight
    context.fillRect(108, 420, 864, 1189)

    if (details.images.length < 24) {
        var addMore = 24 - details.images.length
        for (var i = 0; i < addMore; i++) { 
            details.images.push(details.images[i])
        }
    }
    shuffle(details.images)
    
    // Create clipping path
    let region = new Path2D();
    region.rect(108, 420, 864, 1189)
    context.clip(region)
    for (var i in details.images) {
        if (details.images[i]) {
            let img = await getImgFromURL(details.images[i])
            // get the scale
            var scale = Math.min(225 / img.width, 225 / img.height)
            // get the top left position of the image
            var x = (225 / 2) - (img.width / 2) * scale + 45 + ((i%4)*255)
            var y = (225 / 2) - (img.height / 2) * scale + 265 + (Math.floor(i/4)*255)
            context.drawImage(img, x, y, img.width * scale, img.height * scale)
        }
    }

    return canvas.toDataURL()
}

export async function getListImage(details) {
    const width = 1080
    const height = 1920
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = details.colors.secondaryLight
    context.fillRect(0, 0, width, height)
    
    // Draw the white bkg
    context.fillStyle = '#fff'
    context.roundRect(108, 192, 864, 1536, {upperLeft:18,upperRight:18,lowerLeft:18,lowerRight:18}, true, false);

    // Draw my year in  
    context.fillStyle = "#433f3f"
    context.font = 'bold 32px Futura'
    context.textAlign = 'center'
    context.fillText("My year in", 540, 286)

    let logo = await getImgFromURL(details.logo)
    context.drawImage(logo, 540-logo.naturalWidth*22/logo.naturalHeight, 310, logo.naturalWidth*44/logo.naturalHeight, 44)

    // Draw the swoosh
    context.fillStyle = details.colors.primary
    var p = new Path2D('M972.1,422.4c-106-4.7-212.2-5.1-316,14.8c-185.3,35.4-362.8,134.6-548,136.5v1042.1h864L972.1,422.4L972.1,422.4z');
    context.fill(p);

    // Draw the bottom bar
    context.fillStyle = details.colors.secondary
    context.roundRect(108, 1609, 864, 119, {lowerLeft:18,lowerRight:18}, true, false);
    // Bottom bar text
    context.fillStyle = details.colors.primary
    context.font = 'bold 38px Futura'
    context.fillText("MYYEARINREVIEW.COM", 540, 1686)

    var maxWidth = 170
    context.textAlign = 'left'

    if (details.title) {
        context.fillText(details.title, 200, 460)
    }
    var yOffset = (5 - details.list.length)*25
    for (var i in details.list) {
        if (details.list[i].img) {
            let img = await getImgFromURL(details.list[i].img)
            var scale = Math.min(170 / img.width, 170 / img.height)
            context.fillStyle = details.colors.primaryLight
            context.fillRect(200, yOffset + 500 + 225*i, img.width*scale, img.height*scale);
            context.drawImage(img, 218, yOffset + 518 + 225*i, img.width*scale, img.height*scale)
            maxWidth = Math.max(img.width*scale, maxWidth)
        } else if (details.list[i].thumbtext) {
            context.font = 'bold 50px Futura'
            context.fillStyle = "#fff"
            if (details.list[i].thumbtext != "Half-Marathon") {
                context.fillText(details.list[i].thumbtext, 200, yOffset + 640 + 225*i)
                maxWidth = Math.max(context.measureText(details.list[i].thumbtext).width, maxWidth)
            } else {
                context.fillText("Half-", 200, yOffset + 580 + 225*i)
                context.fillText("Marathon", 200, yOffset + 640 + 225*i)
                maxWidth = Math.max(context.measureText("Marathon").width, maxWidth)
            }
        }
    }
    context.font = 'bold 32px Futura'
    for (var i in details.list) {
        for (var j in details.list[i].titles) {
            context.fillStyle = details.list[i].titles[j].color
            var text = details.list[i].titles[j].text
            var textWidth = context.measureText(text).width
            if (textWidth > 600-maxWidth) {
                text = text + "..."
                while (textWidth > 600-maxWidth) {
                    text = text.substr(0,text.length-4) + "..."
                    var textWidth = context.measureText(text).width
                }
            }
            context.fillText(text, 280 + maxWidth, yOffset + 550 + 225*i + 40*j + (170-(details.list[i].titles.length*40))/2)
        }
    }

    return canvas.toDataURL()
}

export async function getDetailImage(details) {
    const width = 1080
    const height = 1920
    
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    context.fillStyle = details.colors.secondary
    context.fillRect(0, 0, width, height)
    
    // Draw the white bkg
    context.fillStyle = '#fff'
    context.roundRect(108, 192, 864, 1536, {upperLeft:18,upperRight:18,lowerLeft:18,lowerRight:18}, true, false);

    // Draw my year in  
    context.fillStyle = "#433f3f"
    context.font = 'bold 32px Futura'
    context.textAlign = 'center'
    context.fillText("My year in", 540, 286)

    let logo = await getImgFromURL(details.logo)
    context.drawImage(logo, 540-logo.naturalWidth*22/logo.naturalHeight, 310, logo.naturalWidth*44/logo.naturalHeight, 44)

    // Draw the waves
    context.fillStyle = details.colors.primary
    var p = new Path2D('M972.1,451.5c-60.3,23.9-117.4,57-168.6,98.3c-35.9,29-69.2,61.9-107.8,86.8s-84.4,41.4-129,33.1c-56.3-10.6-108.1-59.6-163.5-44.8c-61.4,16.4-88,102.5-149.5,118.4c-48.9,12.7-96-24.7-145.6-33.8v703h864V451.5z');
    context.fill(p);

    // Draw the middle bar
    context.fillStyle = details.colors.secondaryLight
    context.fillRect(108, 1350, 864, 259);

    // Draw the bottom bar
    context.fillStyle = details.colors.primary
    context.roundRect(108, 1609, 864, 119, {lowerLeft:18,lowerRight:18}, true, false);
    // Bottom bar text
    context.fillStyle = details.colors.secondary
    context.font = 'bold 38px Futura'
    context.fillText("MYYEARINREVIEW.COM", 540, 1686)

    let primaryImg = await getImgFromURL(details.primaryImg)
    var scale = Math.min(700 / primaryImg.width, 500 / primaryImg.height)
    context.fillStyle = details.colors.primaryLight
    context.fillRect(520-primaryImg.width*scale/2, 480+(500-primaryImg.height*scale)/2, primaryImg.width*scale, primaryImg.height*scale);
    context.drawImage(primaryImg, 540-primaryImg.width*scale/2, 500+(500-primaryImg.height*scale)/2, primaryImg.width*scale, primaryImg.height*scale);

    context.fillStyle = "#fff"
    context.font = 'bold 26px Futura'
    for (const i in details.topText) {
        context.fillText(details.topText[i], 540, 1130 - 31*(details.topText.length-i-1))
    }

    if (details.strava) {
        if (details.photos.length == 0) {
            context.translate(0, 230);
            context.fillStyle = details.colors.primary
        }
        context.textAlign = 'left'
        context.fillText(nicestr(details.kudos) + ((details.kudos == 1) ? ' kudo' : ' kudos'), 348, 1270)
        context.fillText(nicestr(details.comments) + ((details.comments == 1) ? ' comment' : ' comments'), 625, 1270)
        context.textAlign = 'center'
        context.fillStyle = details.colors.secondary
        p = new Path2D('M310.6,1237.2c-0.8,0-1.6,0.3-2.2,0.9l-11.3,11.3c-0.8,0.8-1.2,1.8-1.2,2.9v20.4c0,2.3,1.8,4.1,4.1,4.1h18.4c1.6,0,3.1-1,3.8-2.5l6.2-14.3c0.2-0.5,0.3-1.1,0.3-1.6v-4.1c0-2.3-1.8-4.1-4.1-4.1h-13l2-9.3c0.2-1-0.1-2.1-0.8-2.8C312.2,1237.5,311.4,1237.2,310.6,1237.2z M285.7,1252.3c-1.1,0-2,0.9-2,2v20.5c0,1.1,0.9,2,2,2h4.1c1.1,0,2-0.9,2-2v-20.5c0-1.1-0.9-2-2-2H285.7z');
        context.fill(p);
        p = new Path2D('M561.1,1284.3c0,1.4,1.7,2.1,2.7,1.1l6.3-6.3h31.5c2.5,0,4.5-2,4.5-4.5v-27c0-2.5-2-4.5-4.5-4.5h-36c-2.5,0-4.5,2-4.5,4.5L561.1,1284.3z M579.1,1266.1c0-1.2,1-2.3,2.3-2.3h11.3c1.2,0,2.3,1,2.3,2.3s-1,2.3-2.3,2.3h-11.3C580.1,1268.4,579.1,1267.4,579.1,1266.1z M572.4,1257.1c0-1.2,1-2.3,2.3-2.3h18c1.2,0,2.3,1,2.3,2.3s-1,2.3-2.3,2.3h-18C573.4,1259.4,572.4,1258.4,572.4,1257.1z');
        context.fill(p);
        if (details.photos.length == 0) {
            context.translate(0, -230);
        }
    } else if (details.bottomText) {
        context.fillText(details.bottomText, 540, 1270)
    }

    if (details.youversion) {
        context.textAlign = 'left'
        context.fillStyle = details.colors.primary
        context.font = 'bold 20px Futura'
        context.fillText("LENGTH", 218, 1414)
        context.fillText("VERSES", 618, 1414)
        context.fillText("COMPLETED", 218, 1518)
        context.font = 'bold 35px Futura'
        context.fillText(details.youversion.length, 218, 1414 + 40)
        context.fillText(details.youversion.verses, 618, 1414 + 40)
        context.fillText(details.youversion.completed, 218, 1518 + 40)
        context.textAlign = 'center'
    }

    context.fillStyle = details.colors.secondary
    context.font = 'bold 33px Futura'
    context.fillText(details.midText.toUpperCase(), 540, 1203)


    if (details.headerphotos) {
        var totalWidth = (details.headerphotos.length - 1)*35
        for (var photo of details.headerphotos) {
            photo.img = await getImgFromURL(photo.url)
            photo.scale = 170 / photo.img.height
            totalWidth += photo.scale*photo.img.width
        }
        var indexWidth = (1080 - totalWidth) / 2
        for (var photo of details.headerphotos) {
            context.fillStyle = details.colors.primaryLight
            context.fillRect(indexWidth-10, 855-10, photo.img.width*photo.scale, photo.img.height*photo.scale)
            context.drawImage(photo.img, indexWidth, 855, photo.img.width*photo.scale, photo.img.height*photo.scale)
            indexWidth += photo.img.width*photo.scale + 35
        }
    }


    // Create clipping path
    let region = new Path2D()
    region.rect(108, 1350, 864, 259)
    context.clip(region)

    if (details.photos) {
        shuffle(details.photos)
        var totalWidth = (details.photos.length - 1)*35
        for (var photo of details.photos) {
            photo.img = await getImgFromURL(photo.url)
            photo.scale = 170 / photo.img.height
            totalWidth += photo.scale*photo.img.width
        }
        var indexWidth = (1080 - totalWidth) / 2
        for (var photo of details.photos) {
            context.fillStyle = details.colors.secondary
            context.fillRect(indexWidth-10, 1394-10, photo.img.width*photo.scale, photo.img.height*photo.scale)
            context.drawImage(photo.img, indexWidth, 1394, photo.img.width*photo.scale, photo.img.height*photo.scale)
            indexWidth += photo.img.width*photo.scale + 35
        }
    }

    return canvas.toDataURL()
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
} 