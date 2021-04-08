//  Menu links highlight admin area

const currentPage = window.location.pathname
const menuLinks = document.querySelectorAll('nav a')


for (const link of menuLinks) {
    if (currentPage.includes(link.getAttribute('href'))) {
        link.classList.add('active')
    }
}


const recipesAdmin = document.querySelectorAll('.card.admin-index')
recipesAdmin.forEach(card => {
    const id = card.lastChild.previousElementSibling.value
    card.addEventListener('click', () => location.href=`/admin/recipes/${id}` )
});
