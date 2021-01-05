import { getSummaryImage, getListImage, getDetailImage, nicestr } from "./utilities.js"

export async function getStravaImage(state) {

    if (!state.user || !state.user.activities) {
        return null
    }

    var timeString = (state.user.activities["Run"].time / 3600).toFixed(0) + 'h '
    timeString = timeString + ((state.user.activities["Run"].time % 3600) / 60).toFixed(0) + 'm'

    var details = {
        colors: {
            primary: '#00695c',
            secondary: '#ffa940',
            primaryLight: '#00897c',
            secondaryLight: '#ffdeb0',
        },
        logo: require("./images/strava.png"),
    }

    var sumDetails = {
        ...details,
        title: {
            top: ["In 2020 I ran"],
            middle: nicestr(state.user.activities["Run"].distance/1000),
            bottom: ["kilometers"],
        },
        moreStats: [
            {
                title: "RUNS",
                value: nicestr(state.user.activities["Run"].count)
            },
            {
                title: "TIME",
                value: timeString
            },
            {
                title: "ELEVATION GAIN",
                value: nicestr(state.user.activities["Run"].gain) + 'm'
            },            
        ],
        icon: new Path2D("M583.4,806.6c-34.2,0-62.1,28-62.1,62.1c0,34.1,28,62.1,62.1,62.1c34.2,0,62.1-28,62.1-62.1C645.6,834.5,617.6,806.6,583.4,806.6z M397.1,893.5c-6.5,0-12.5,1.8-17.7,4.7c-1.2,0.4-2.3,1-3.4,1.7l-86,61.8c-1.5,1.1-2.8,2.5-3.6,4.1c-7.8,6.8-13.4,16.1-13.4,27.2c0,20.4,16.8,37.3,37.3,37.3c6.1,0,10.8-3.3,15.9-5.9c2.6,0,5.2-0.8,7.4-2.3l69.4-49.9l33.7,10.7l-53,86.4c-0.6,1-1.1,2-1.4,3.1c-5.4,8.7-9.1,18.8-9.7,29.7c-0.3,0.4-0.5,0.8-0.8,1.2l-40.5,63.8h-89.3c-23.9,0-43.5,19.6-43.5,43.5c0,23.9,19.6,43.5,43.5,43.5h104.8c20.1,0,39-9.8,50.7-26.2l36-50.9L492,1213l-19.6,100.7c-0.1,0.8-0.2,1.7-0.2,2.6c-0.3,1.9-0.6,3.8-0.6,5.9c0,23.9,19.6,43.5,43.5,43.5c18.1,0,31.9-12.3,38.4-28.1c2.2-1.9,3.7-4.4,4.3-7.3v0l25.2-132.5c0.2-1,0.2-2,0.2-3c0.1-0.9,0.2-1.4,0.2-2.9c0-9.1-3.8-16.9-9.2-23.3c-0.7-1.7-1.8-3.3-3.2-4.5l-60-53.1l21-41.4l17.5,38.5c0.4,0.9,0.9,1.7,1.4,2.4c6.4,11.5,18.5,19.4,32.5,19.4h87c20.4,0,37.3-16.8,37.3-37.3s-16.8-37.3-37.3-37.3h-66.3l-33.5-79.8c-1.8-15.4-11.4-27.9-24.1-35.8c-1.1-1.7-2.6-3.1-4.4-4L511,918.1c-1.1-0.6-2.2-1-3.4-1.3l-101.4-22.1c-1-0.2-1.9-0.3-2.9-0.2C401.3,894,399.4,893.5,397.1,893.5z")
    }

    var list = []
    for (const key in state.user.prs) {
        if (state.user.prs[key].time > 0) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            var strindex
            if (state.user.prs[key].time > 36000) {
                strindex = 11
            } else if (state.user.prs[key].time > 3600) {
                strindex = 12
            } else if (state.user.prs[key].time > 600) {
                strindex = 14
            } else {
                strindex = 15
            }
            list.push({
                titles: [
                    {text: new Date(state.user.prs[key].time * 1000).toISOString().substr(strindex, 19-strindex), color: "#ffa940"},
                    {text: new Date(state.user.prs[key].date).toLocaleDateString(undefined, options), color: "#fff"}
                ],
                thumbtext: key
            })
        }
    }

    var listDetails = {
        ...details,
        list: list,
        title: "New PRs: " + list.length
    }

    var detailDetails = {
        ...details,
        primaryImg: state.user.maxKudos.img,
        topText: ["My highest kudos-ed run was"],
        midText: state.user.maxKudos.name,
        strava: true,
        kudos: state.user.maxKudos.kudos,
        comments: state.user.maxKudos.comments,
        photos: state.user.photos
    }

    var imgs = []
    var sumImg = await getSummaryImage(sumDetails)
    imgs.push(sumImg)
    var listImg = await getListImage(listDetails)
    imgs.push(listImg)
    var detailImg = await getDetailImage(detailDetails)
    imgs.push(detailImg)

    return imgs
}