const cards = document.querySelectorAll(".card")
// const modal = document.querySelector(".modal-overlay")

// const modalContent = document.querySelector(".modal-content")





// cards.forEach(card => {
//     let image = card.querySelector(".image-container")
//     let recipe = card.querySelector(".recipe-name")
//     let author = card.querySelector(".author")

    // card.addEventListener("click", () => {
    //     modal.classList.add('active')
    //     modalContent.innerHTML += `
    //             <div class="image-container">
    //                 ${image.innerHTML}
    //             </div>
    //             <div class="recipe-name">
    //                 ${recipe.innerHTML}
    //             </div>
    //             <div class="author">
    //                 ${author.innerHTML}
    //             </div>   `
    // })
          


// document.querySelector(".close-modal").addEventListener("click", () => {
//     modal.classList.remove('active')
//     modalContent.innerHTML = ""
// })

for (let index = 0; index < cards.length; index++) {
    cards[index].addEventListener("click", () => {
        window.location.href = `/recipes/${index}`
    })
    
}

