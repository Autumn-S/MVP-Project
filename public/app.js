// Function to create a character div
function createCharacterDiv(characterData) {
  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character");

  const h2 = document.createElement("h2");
  h2.textContent = characterData.char_name;

  const p1 = document.createElement("p");
  p1.textContent = `Level: ${characterData.char_level}`;

  const p2 = document.createElement("p");
  p2.textContent = `Class: ${characterData.char_class}`;

  const updateButton = document.createElement("button");
  updateButton.classList.add("update");
  updateButton.textContent = "Update";
  updateButton.addEventListener("click", handleUpdate);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", handleDelete);

  characterDiv.appendChild(h2);
  characterDiv.appendChild(p1);
  characterDiv.appendChild(p2);
  characterDiv.appendChild(updateButton);
  characterDiv.appendChild(deleteButton);

  return characterDiv;
}

// Function to toggle visibility of an element
function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

// Event listeners for toggle links
const aboutLink = document.getElementById("aboutLink");
aboutLink.addEventListener("click", function () {
  toggleVisibility("aboutContainerBox");
});

const createLink = document.getElementById("createLink");
createLink.addEventListener("click", function () {
  toggleVisibility("formBox");
});

const displayLink = document.getElementById("displayLink");
displayLink.addEventListener("click", function () {
  toggleVisibility("characterContainerBox");
});

// Function to load and display character data
function loadAndDisplayCharacterData() {
  fetch("/api/characters")
    .then((res) => res.json())
    .then((data) => {
      const characterContainer = document.getElementById("characterContainer");
      characterContainer.innerHTML = "";

      data.forEach((character) => {
        const characterDiv = createCharacterDiv(character);
        characterContainer.appendChild(characterDiv);
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to delete a character
function deleteCharacter() {
  fetch("/api/characters/:id", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(characterData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Character deleted successfully!");
      } else {
        console.log("Error deleting character.");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to update a character
function updateCharacter() {
  fetch("/api/characters/:id", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(characterData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Character updated successfully!");
        console.log(characterData);
      } else {
        console.log("Error updating character.");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to handle form submission
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
          return response.json();
        } else {
          throw new Error("Error saving character.");
        }
      })
      .then((data) => {
        const characterDiv = createCharacterDiv(data);
        document.getElementById("characters").appendChild(characterDiv);
        alert("Character created successfully!");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
