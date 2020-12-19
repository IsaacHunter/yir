import { getSummaryImage, getGalleryImage, getListImage, getDetailImage, nicestr } from "./utilities.js"

export async function getGoodreadsImage(state) {      
    if (!state.user) {
        return null
    }

    var details = {
        colors: {
            primary: '#9c27b0',
            secondary: '#ffca28',
            primaryLight: '#ba68c8',
            secondaryLight: '#ffecb3',
        },
        logo: require("./images/goodreads.jpg"),
    }

    var sumDetails = {
        ...details,
        title: {
            top: "In 2020 I read",
            middle: nicestr(state.user.books.length),
            bottom: "books",
        },
        moreStats: [
            {
                title: "PAGES",
                value: nicestr(state.user.pages)
            },       
            {
                title: "AVG PAGES",
                value: nicestr(state.user.pages/state.user.books.length)
            },            
        ],
        icon: new Path2D("M913.2,874.2c-0.9,0-7.2,0-12.2,0.3v-12c0-14.6-8.7-25.5-21.7-25.5c-1.5,0-2.4,0.1-3.9,0.4c-1.1,0.2-103.5,21.2-183.9,85.5c-15.6-12.4-33-23.3-48.1-32.6v-12.7c0-22.4-2.7-45.3-37.1-57.3L562.4,805c-4.6-1.7-9.1-2.5-13.4-2.5c-20.6,0-32.9,18.6-32.9,36.7c0,0.1,0,0.1,0,0.2c-5.1-1.3-8.1-1.9-8.3-1.9c-1.5-0.3-4.9-0.4-6.4-0.4c-13,0-24.8,11-24.8,25.5v12c-5.1-0.3-11.3-0.3-12.2-0.3c-15.5,0-28.2,12.6-28.2,28.1V1124c0,13.7,15.2,25.2,25.3,27.6v24.2c0,15.5,14.1,29.1,29.6,29.1h159c4.5,5.1,14.2,15.2,25.5,15.2h32.5c11.3,0,21-10.1,25.5-15.2h165.1c15.5,0,27.4-13.6,27.4-29.1v-26.1c10.1-4.4,15.2-14.3,15.2-25.7V902.4C941.4,886.9,928.8,874.2,913.2,874.2z M898.8,1184.7H742.5c66.6-25.3,133.3-31.5,158.5-32.4v23.5C901,1179.4,902.3,1184.7,898.8,1184.7z M481.8,1175.8v-23.3c35.4,1.3,97.6,6.9,159.7,32.1H491.2C487.7,1184.7,481.8,1179.4,481.8,1175.8z M461.6,902.4c0-3.5,1.1-6.4,4.7-6.4c0.2,0,5.4,0,10.5,0.4v187.8c0,14.7,12.1,28.2,25.1,30.8c6.7,1.3,47.7,9.8,95,31.6c-64.3-15.4-120.2-16.1-129.1-16.1c-3.5,0-6.1-2.9-6.1-6.4V902.4z M502.3,858.8c0.4,0.1,14.8,3,35,9.8v141.2c0,3.5,3.1,6.7,6.1,8.5c3,1.8,7.4,1.8,10.4,0.1l34.8-19l37.5,44.6c1.9,2.3,4.8,3.5,7.7,3.5c1.1,0,2.2-0.2,3.3-0.6c3.9-1.4,6.4-5.1,6.4-9.3V915.5c10.1,7.9,25.3,16.7,40.4,26.5v1.5v227c-75.8-56.2-164.2-74.8-174.7-76.9c-2.3-0.4-7.2-4.6-7.2-9.5V862.5C502,860.1,501.7,858.9,502.3,858.8z M549.1,822.3c2,0,4.3,0.4,6.8,1.3l43.7,15.4c20.6,7.2,23.6,17.3,23.6,38.6v132.9l-24.7-30c-1.9-2.3-4.5-3.5-7.4-3.5c-1.6,0-4.2,0.4-5.7,1.2L557.5,993V863c0-8.6,1-28.7-19.9-28.7c-0.7,0-1,0.1-1.7,0.3C537.2,828.6,541.6,822.3,549.1,822.3z M880.8,1084.1c0,5-2.4,9-4.6,9.5c-10.4,2.1-96.4,20.7-172.1,76.9v-227V942c75.8-62.7,175.4-83.1,176.6-83.3c0.3,0.2,0.2,1.4,0.2,3.8V1084.1z M915.2,1130.4c-9,0-65,0.7-129.2,16.1c47.2-21.8,86.2-30.3,92.9-31.6c13-2.6,22.1-16.1,22.1-30.8V896.3c5.1-0.3,12.8-0.4,13-0.4c3.5,0,7.2,2.9,7.2,6.4V1124C921.2,1127.5,918.7,1130.4,915.2,1130.4z")
    }

    if (state.user.audiobooks) {
        sumDetails.moreStats = [
            {
                title: "AUDIOBOOKS",
                value: nicestr(state.user.audiobooks)
            },
            {
                title: "PAPER BOOKS",
                value: nicestr(state.user.books.length - state.user.audiobooks)
            },
            {
                title: "PAGES",
                value: nicestr(state.user.pages)
            },       
            {
                title: "AVG PAGES",
                value: nicestr(state.user.pages/state.user.books.length)
            },            
        ]
    }

    var galDetails = {
        ...details,
        images: state.user.imgs
    }

    var listDetails = {
        ...details,
        list: [
            {
                titles: [
                    {text: "Longest Book", color: "#ffca28"},
                    {text: nicestr(state.user.bookList.longest.count) + " pages", color: "#fff"}
                ],
                img: state.user.bookList.longest.img
            },
            {
                titles: [
                    {text: "Shortest Book", color: "#ffca28"},
                    {text: nicestr(state.user.bookList.shortest.count) + " pages", color: "#fff"}
                ],
                img: state.user.bookList.shortest.img
            },
            {
                titles: [
                    {text: "Most Popular", color: "#ffca28"},
                    {text: nicestr(state.user.bookList.popular.count) + " people also", color: "#fff"},
                    {text: "shelved this book", color: "#fff"}
                ],
                img: state.user.bookList.popular.img
            },
            {
                titles: [
                    {text: "Least Popular", color: "#ffca28"},
                    {text: nicestr(state.user.bookList.unpopular.count) + " people also", color: "#fff"},
                    {text: "shelved this book", color: "#fff"}
                ],
                img: state.user.bookList.unpopular.img
            },
            {
                titles: [
                    {text: "Highest Rated", color: "#ffca28"},
                    {text: "on Goodreads", color: "#ffca28"},
                    {text: state.user.bookList.rating.count + " / 5 stars", color: "#fff"}
                ],
                img: state.user.bookList.rating.img
            },
        ]
    }


    var imgs = []
    var sumImg = await getSummaryImage(sumDetails)
    imgs.push(sumImg)
    var galImg = await getGalleryImage(galDetails)
    imgs.push(galImg)
    var listImg = await getListImage(listDetails)
    imgs.push(listImg)
    
    if (state.user.author) {
        var detailDetails = {
            ...details,
            primaryImg: state.user.author.img,
            topText: [(state.user.author.booksThisYear.length == 1) ? 'I read another book by' : 'I read another ' + state.user.author.booksThisYear.length + ' books by',
            'one of my favourite authors'],
            midText: state.user.author.name,
            bottomText: "to go along with:",
            strava: false,
            photos: state.user.author.previousBooks,
            headerphotos: state.user.author.booksThisYear
        }
        var detailImg = await getDetailImage(detailDetails)
        imgs.push(detailImg)
    }

    return imgs
}
