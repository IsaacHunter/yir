export const getImgFromURL = (source) => new Promise( resolve => {
    let fav = new Image();
    fav.onload = function() {
        resolve(fav)
    };
    fav.crossOrigin="anonymous" 
    fav.src = source
})