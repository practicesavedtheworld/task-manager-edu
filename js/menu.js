async function menuHandler() {
    // Shading SVG elements and tbody on hover
    let images = document.querySelectorAll('img');
    for (let img of images) {
        mouseMovementHandler(img, '#849653');
    }


}


menuHandler()

