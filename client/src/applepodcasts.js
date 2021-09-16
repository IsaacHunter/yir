import { getSummaryImage, getListImage, nicestr } from "./utilities.js"

export async function getApplepodcastsImage(state) {      
    if (!state.user) {
        return null
    }

    var details = {
        colors: {
            primary: '#412da8',
            secondary: '#6df7f7',
            primaryLight: '#5c3bb9',
            secondaryLight: '#beddfc',
        },
        logo: require("./images/apple-podcasts.png"),
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    var bingeDay = new Date(state.user.podStats.binge.date)

    var sumDetails = {
        ...details,
        title: {
            top: ["In 2021 I", "listened to"],
            middle: nicestr(state.user.podStats.count),
            bottom: ["podcast", "episodes"],
        },
        moreStats: [
            {
                title: "MINUTES",
                value: nicestr(Math.floor(state.user.podStats.duration/60))
            },       
            {
                title: "SHOWS",
                value: nicestr(state.user.podStats.shows)
            },       
            {
                title: "BIGGEST BINGE DAY • " + nicestr(Math.floor(state.user.podStats.binge.duration/60)) + " MINUTES",
                value: bingeDay.toLocaleDateString(undefined, options)
            },            
        ],
        icon: new Path2D("M623.9,869.6c-31,0-66.2,16.2-87.5,40.6v93.9c21.3,24.4,56.5,40.6,87.5,40.6c8.3,0,16.3-1.2,23.9-3.4v130.7h63.6V957.1C711.4,908.8,672.2,869.6,623.9,869.6z M830.8,869.6c-48.3,0-87.5,39.2-87.5,87.5v214.8h63.6v-130.7c7.6,2.1,15.6,3.4,23.9,3.4c31,0,66.2-16.2,87.5-40.6v-93.9C897,885.8,861.8,869.6,830.8,869.6z M584.1,933.2c8.8,0,15.9,7.1,15.9,15.9s-7.1,15.9-15.9,15.9s-15.9-7.1-15.9-15.9S575.4,933.2,584.1,933.2z M870.6,933.2c8.8,0,15.9,7.1,15.9,15.9s-7.1,15.9-15.9,15.9c-8.8,0-15.9-7.1-15.9-15.9S861.8,933.2,870.6,933.2z M687.6,949.2c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S683.2,949.2,687.6,949.2z M767.1,949.2c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S762.7,949.2,767.1,949.2zM647.8,1203.7v15.9c0,8.8,7.1,15.9,15.9,15.9h31.8c8.8,0,15.9-7.1,15.9-15.9v-15.9H647.8z M743.3,1203.7v15.9c0,8.8,7.1,15.9,15.9,15.9H791c8.8,0,15.9-7.1,15.9-15.9v-15.9H743.3z")
    }

    var listDetails = {
        ...details,
        title: "Top Podcasts",
        list: [
            {
                titles: [
                    {text: state.user.topPods[0].title, color: "#6df7f7"},
                    {text: nicestr(Math.floor(state.user.topPods[0].duration/60)) + " minutes", color: "#fff"},
                    {text: nicestr(state.user.topPods[0].count) + " episodes", color: "#fff"},
                ],
                img: state.user.topPods[0].url
            },
            {
                titles: [
                    {text: state.user.topPods[1].title, color: "#6df7f7"},
                    {text: nicestr(Math.floor(state.user.topPods[1].duration/60)) + " minutes", color: "#fff"},
                    {text: nicestr(state.user.topPods[1].count) + " episodes", color: "#fff"},
                ],
                img: state.user.topPods[1].url
            },
            {
                titles: [
                    {text: state.user.topPods[2].title, color: "#6df7f7"},
                    {text: nicestr(Math.floor(state.user.topPods[2].duration/60)) + " minutes", color: "#fff"},
                    {text: nicestr(state.user.topPods[2].count) + " episodes", color: "#fff"},
                ],
                img: state.user.topPods[2].url
            },
            {
                titles: [
                    {text: state.user.topPods[3].title, color: "#6df7f7"},
                    {text: nicestr(Math.floor(state.user.topPods[3].duration/60)) + " minutes", color: "#fff"},
                    {text: nicestr(state.user.topPods[3].count) + " episodes", color: "#fff"},
                ],
                img: state.user.topPods[3].url
            },
            {
                titles: [
                    {text: state.user.topPods[4].title, color: "#6df7f7"},
                    {text: nicestr(Math.floor(state.user.topPods[4].duration/60)) + " minutes", color: "#fff"},
                    {text: nicestr(state.user.topPods[4].count) + " episodes", color: "#fff"},
                ],
                img: state.user.topPods[4].url
            },
        ]
    }


    var imgs = []
    var sumImg = await getSummaryImage(sumDetails)
    imgs.push(sumImg)
    var listImg = await getListImage(listDetails)
    imgs.push(listImg)

    return imgs
}