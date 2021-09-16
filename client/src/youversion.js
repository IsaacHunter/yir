import { getSummaryImage, getGalleryImage, getDetailImage, nicestr } from "./utilities.js"

export async function getYouversionImage(state) {      
    if (!state.user) {
        return null
    }
    
    var details = {
        colors: {
            primary: '#009688',
            secondary: '#cddc39',
            primaryLight: '#4db6ab',
            secondaryLight: '#f0f4c3',
        },
        logo: require("./images/youversion.png"),
    }

    var sumDetails = {
        ...details,
        title: {
            top: ["In 2021 I spent"],
            middle: nicestr(state.user.streakData.this_year),
            bottom: ["days in the","bible app"],
        },
        moreStats: [
            {
                title: "BEST STREAK",
                value: nicestr(state.user.streakData.longest_streak)
            },       
            {
                title: "PERFECT WEEKS",
                value: nicestr(state.user.streakData.perfect_weeks)
            },   
            {
                title: "COMPLETED PLANS",
                value: nicestr(state.user.streakData.plans)
            },            
        ],
        icon: new Path2D("M624.1,798.1c-41.5,0-75.1,33.6-75.1,75.1s33.6,75.1,75.1,75.1c41.5,0,75.1-33.6,75.1-75.1S665.6,798.1,624.1,798.1z M436.3,967.2c-10.4,0-18.8,8.4-18.8,18.8v56.4c-11.3,0-18.8,7.5-18.8,18.8v37.6c0,11.3,7.5,18.8,18.8,18.8v75.1c0,10.4,8.4,18.8,18.8,18.8c52.9,0,98.3,7,129.1,16.7c15.4,4.9,27.1,10.6,33.7,15.3c6.6,4.8,6.3,7.2,6.3,5.5c-0.1,10.4,8.1,18.9,18.5,19.1s18.9-8.1,19.1-18.5c0-0.2,0-0.4,0-0.5c0,1.7-0.3-0.7,6.3-5.5c6.6-4.8,18.3-10.5,33.7-15.3c30.8-9.8,76.3-16.7,129.1-16.7c10.4,0,18.8-8.4,18.8-18.8v-75.1c11.3,0,18.8-7.5,18.8-18.8v-37.6c0-11.3-7.5-18.8-18.8-18.8V986c0-10.4-8.4-18.8-18.8-18.8c-67.5,0-116.4,9.7-148.8,19.6c-19,5.8-31,11.3-39.1,15.4c-8.1-4.2-20.1-9.6-39.1-15.4C552.7,976.9,503.8,967.2,436.3,967.2z M455.1,1006.1c52.8,1.7,93.5,8.8,118.9,16.7c22.7,7,27.5,10.7,31.4,13v81.8v86.3c-8.5-4.2-17.9-8.1-28.6-11.4c-31.6-10-74-15.8-121.7-17.3v-62.9c11.2-6.5,18.8-18.5,18.8-32.3s-7.6-25.8-18.8-32.3V1006.1z M793.2,1006.1v41.5c-11.2,6.5-18.8,18.5-18.8,32.3c0,13.8,7.6,25.8,18.8,32.3v62.8c-47.6,1.5-90.1,7.3-121.7,17.3c-10.7,3.4-20.2,7.2-28.6,11.4v-86.3v-81.8c3.9-2.3,8.7-6,31.4-13C699.7,1014.9,740.4,1007.8,793.2,1006.1z")
    }

    var galDetails = {
        ...details,
        images: state.user.photos
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    var completed = new Date(state.user.longestPlan.completed_dt)

    var detailDetails = {
        ...details,
        primaryImg: state.user.longestPlan.best_img,
        topText: ['My longest reading plan was'],
        midText: state.user.longestPlan.name.default,
        strava: false,
        youversion: {
            length: state.user.longestPlan.formatted_length.default,
            verses: nicestr(state.user.longestPlan.num_verses),
            completed: completed.toLocaleDateString(undefined, options)
        }
    }

    var imgs = []
    var sumImg = await getSummaryImage(sumDetails)
    imgs.push(sumImg)
    var detailImg = await getDetailImage(detailDetails)
    imgs.push(detailImg)
    var galImg = await getGalleryImage(galDetails)
    imgs.push(galImg)

    return imgs
}