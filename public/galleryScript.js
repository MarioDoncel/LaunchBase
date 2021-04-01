// ========== Gallery ========
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const {target} = event
        ImageGallery.previews.forEach(preview => preview.classList.remove("active"))
        target.classList.add('active')
        ImageGallery.highlight.src = target.src
    }
}
const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-close'),
    open(e){
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.closeButton.style.top = 0
        Lightbox.image.src = e.target.src
    },
    close(){
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = '-100%'
        Lightbox.closeButton.style.top = '-80px'
    }
}