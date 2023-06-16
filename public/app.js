function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

function updateCharacter(character) {
  fetch(`/api/characters/${character.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  })
    .then((response) => {
      if (response.ok) {
        alert("Character updated successfully!");
        loadAndDisplayCharacterData();
      } else {
        console.log("Error updating character.");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function deleteCharacter(character) {
  fetch(`/api/characters/${character.id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Character deleted successfully!");
        loadAndDisplayCharacterData();
      } else {
        console.log("Error deleting character.");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function loadAndDisplayCharacterData() {
  fetch("/api/characters")
    .then((res) => res.json())
    .then((data) => {
      const characterContainer = document.getElementById("characterContainer");
      characterContainer.innerHTML = "";

      data.forEach((character) => {
        const characterElement = document.createElement("div");
        characterElement.classList.add("character-item");

        const characterText = document.createElement("span");
        characterText.textContent = `${character.char_name} - Level ${character.char_level} ${character.char_class}`;
        characterElement.appendChild(characterText);

        characterContainer.appendChild(characterElement);
      });

      toggleVisibility("characterContainerBox");
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

document.getElementById("createLink").addEventListener("click", function () {
  toggleVisibility("formBox");
});

document.addEventListener("DOMContentLoaded", function () {
  loadAndDisplayCharacterData(); // Fetch character data on page load

  const updateLink = document.getElementById("updateLink");
  updateLink.addEventListener("click", function () {
    loadAndDisplayCharacterData();
    toggleVisibility("characterContainerBox");
  });

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
            document.getElementById("characterForm").reset();
            loadAndDisplayCharacterData();
          } else {
            console.log("Error saving character.");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
});
