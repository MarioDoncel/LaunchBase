
// ========== Add ingredient =========

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }
  
  document
    .querySelector(".add-ingredient")
    .addEventListener("click", addIngredient);

 // ========= Delete ingredient ===========

 function deleteIngredient(event) {
  const ingredient = event
  ingredient.parentElement.remove()
}

// ======== Add step ========
function addStep() {
  const steps = document.querySelector("#steps");
  const fieldContainer = document.querySelectorAll(".step");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  steps.appendChild(newField);
  }
  
  document
    .querySelector(".add-step")
    .addEventListener("click", addStep);


  // ========= Delete step =======

  function deleteStep(event) {
    const step = event
    step.parentElement.remove()
  }
  

  