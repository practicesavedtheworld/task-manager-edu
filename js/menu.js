function mouseMovementHandler(element, shadow) {
    element.addEventListener('mouseenter', () => {
        element.style.backgroundColor = shadow;
        element.style.cursor = 'pointer';
    })

    element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = '';
        element.style.cursor = 'default';
    })
}


async function menuHandler() {
    // Shading SVG elements and tbody on hover
    let images = document.querySelectorAll('img');
    for (let img of images) {
        mouseMovementHandler(img, '#849653');
    }


}


menuHandler()

