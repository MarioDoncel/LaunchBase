const cards = document.querySelectorAll(".card")
const currentPage = window.location.pathname
const menuLinks = document.querySelectorAll('nav a')


for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", () => {
        window.location.href = `/recipes/${index}`
    })
    
}

for (const link of menuLinks) {
    if (currentPage.includes(link.getAttribute('href'))) {
        link.classList.add('active')
    }
}
