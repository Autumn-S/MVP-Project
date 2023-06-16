// Function to toggle visibility of an element
function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  if (element.style.display === "none") {
    element.style.display = "block";
    element.classList.add("centered");
  } else {
    element.style.display = "none";
    element.classList.remove("centered");
  }
}

function updateCharacter(character) {
  // Send a PUT request to update the character
  fetch(`/api/characters/${character.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  })
    .then((response) => {
      if (response.ok) {
        alert("Character updated!");
        // Retrieve updated character data after update
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
  // Send a DELETE request to delete the character
  fetch(`/api/characters/${character.id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Character deleted!");
        // Retrieve updated character data after deletion
        loadAndDisplayCharacterData();
      } else {
        console.log("Error deleting character.");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to load and display character data
function loadAndDisplayCharacterData() {
  fetch("/api/characters")
    .then((res) => res.json())
    .then((data) => {
      const characterContainer = document.getElementById("characterContainer");

      // Clear the existing character data in the container
      characterContainer.innerHTML = "";

      // Iterate over the character data and create HTML elements for each character
      data.forEach((character) => {
        const characterElement = document.createElement("div");
        characterElement.classList.add("character-item");

        const characterText = document.createElement("span");
        characterText.textContent = `${character.char_name} - Level ${character.char_level} ${character.char_class}`;
        characterElement.appendChild(characterText);

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
          // Handle update button click
          updateCharacter(character);
        });
        characterElement.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          // Handle delete button click
          deleteCharacter(character);
        });
        characterElement.appendChild(deleteButton);

        characterContainer.appendChild(characterElement);
      });
    });
}

// Event listeners
document.getElementById("createLink").addEventListener("click", function () {
  toggleVisibility("formBox");
});

document.addEventListener("DOMContentLoaded", function () {
  const updateLink = document.getElementById("updateLink");
  updateLink.addEventListener("click", function () {
    loadAndDisplayCharacterData();
    toggleVisibility("characterContainerBox");
  });

  document
    .getElementById("characterForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

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
            alert("Character created!");
            document.getElementById("characterForm").reset();
            // Retrieve updated character data after creation
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
