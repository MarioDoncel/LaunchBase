const hideShow = document.querySelectorAll("span")


console.log(hideShow[0])
hideShow.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active')

        if (item.matches(".active")) {
            item.innerHTML = "esconder"
            item.parentElement.nextElementSibling.style.display = "block"
        } else {
            item.innerHTML = "mostrar"
            item.parentElement.nextElementSibling.style.display = "none"
        }
    })
})