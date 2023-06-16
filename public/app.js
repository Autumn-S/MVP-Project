const formBox = document.getElementById("formBox");
const createLink = document.getElementById("createLink");
const updateLink = document.getElementById("updateLink");
const characterForm = document.getElementById("characterForm");
const charNameInput = document.getElementById("charName");
const charLevelInput = document.getElementById("charLevel");
const charClassInput = document.getElementById("charClass");
const characterContainer = document.getElementById("characterContainer");

function toggleVisibility() {
  formBox.style.display = formBox.style.display === "none" ? "block" : "none";
  formBox.classList.toggle("centered");
}

function clearCharacterContainer() {
  characterContainer.innerHTML = "";
}

function createCharacterElement(character) {
  const characterElement = document.createElement("div");
  characterElement.textContent = `${character.char_name} - Level ${character.char_level} ${character.char_class}`;
  return characterElement;
}

function fetchCharacters() {
  return fetch("/api/characters").then((res) => res.json());
}

function updateCharacterContainer(data) {
  clearCharacterContainer();
  data.forEach((character) => {
    const characterElement = createCharacterElement(character);
    characterContainer.appendChild(characterElement);
  });
}

function resetCharacterForm() {
  characterForm.reset();
}

function showAlert(message) {
  alert(message);
}

function handleError(error) {
  console.log("Error:", error);
}

createLink.addEventListener("click", toggleVisibility);

updateLink.addEventListener("click", function () {
  fetchCharacters()
    .then((data) => {
      console.log("characters data", data);
      updateCharacterContainer(data);
    })
    .catch(handleError);
});

characterForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const charName = charNameInput.value;
  const charLevel = charLevelInput.value;
  const charClass = charClassInput.value;

  const characterData = {
    char_name: charName,
    char_level: charLevel,
    char_class: charClass,
  };

  fetch("/api/characters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(characterData),
  })
    .then((response) => {
      if (response.ok) {
        showAlert("Character created!");
        resetCharacterForm();
        return fetchCharacters();
      } else {
        console.log("Error saving character.");
      }
    })
    .then((data) => {
      if (data) {
        console.log("characters data", data);
        updateCharacterContainer(data);
      }
    })
    .catch(handleError);
});
