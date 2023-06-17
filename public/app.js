function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

const createLink = document.getElementById("createLink");
createLink.addEventListener("click", function () {
  toggleVisibility("formBox");
});

const updateLink = document.getElementById("updateLink");
updateLink.addEventListener("click", function () {
  toggleVisibility("characterContainerBox");
});

function loadAndDisplayCharacterData() {
  fetch("/api/characters")
    .then((res) => res.json())
    .then((data) => {
      const characterContainer = document.getElementById("characterContainer");
      characterContainer.innerHTML = "";

      data.forEach((character) => {
        const characterElement = document.createElement("div");
        characterElement.textContent = `Name: ${character.char_name} Level: ${character.char_level} Class: ${character.char_class}`;
        characterContainer.appendChild(characterElement);
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

document
  .getElementById("characterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const charName = document.getElementById("charName").value;
    const charLevel = document.getElementById("charLevel").value;
    const charClass = document.getElementById("charClass").value;

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
          alert("Character created successfully!");
          console.log(characterData);
        } else {
          console.log("Error saving character.");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
