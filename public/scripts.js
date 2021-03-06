//  Menu links highlight admin area

const currentPage = window.location.pathname
const menuLinks = document.querySelectorAll('nav a')


for (const link of menuLinks) {
    if (currentPage.includes(link.getAttribute('href'))) {
        link.classList.add('active')
    }
}
