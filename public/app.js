function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

function updateCharacter(character) {
  fetch("/api/characters/:id", {
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

function deleteCharacter() {
  fetch("/api/characters/:id", {
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

function displayCharacterData(characterData) {
  const characterDisplay = document.getElementById("characterDisplay");
  characterDisplay.innerHTML = `
      <h2>Character Information</h2>
      <p><strong>Name:</strong> ${characterData.char_name}</p>
      <p><strong>Level:</strong> ${characterData.char_level}</p>
      <p><strong>Class:</strong> ${characterData.char_class}</p>
    `;
}

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

document.addEventListener("DOMContentLoaded", function () {
  loadAndDisplayCharacterData(); // Fetch character data on page load
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
            response.json().then((data) => {
              displayCharacterData(data);
            });
          } else {
            console.log("Error saving character.");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
});
