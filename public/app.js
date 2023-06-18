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

// Click event listener to hide div when clicked outside
document.addEventListener("click", function (event) {
  const aboutContainer = document.getElementById("aboutContainerBox");
  const formBox = document.getElementById("formBox");
  const characterContainer = document.getElementById("characterContainerBox");

  if (
    !aboutContainer.contains(event.target) &&
    event.target !== aboutLink &&
    aboutContainer.style.display === "block"
  ) {
    toggleVisibility("aboutContainerBox");
  }

  if (
    !formBox.contains(event.target) &&
    event.target !== createLink &&
    formBox.style.display === "block"
  ) {
    toggleVisibility("formBox");
  }

  if (
    !characterContainer.contains(event.target) &&
    event.target !== displayLink &&
    characterContainer.style.display === "block"
  ) {
    toggleVisibility("characterContainerBox");
  }
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
function deleteCharacter(characterData) {
  fetch(`/api/characters/${characterData.characterId}`, {
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

function handleUpdate(event) {
  const characterDiv = event.target.closest(".character");
  const charName = characterDiv.querySelector("h2").textContent;
  const charLevel = characterDiv
    .querySelector("p:nth-child(2)")
    .textContent.split(" ")[1];
  const charClass = characterDiv
    .querySelector("p:nth-child(3)")
    .textContent.split(" ")[1];

  const characterData = {
    char_name: charName,
    char_level: charLevel,
    char_class: charClass,
  };

  // Unhide the formContainer div before the update form is displayed
  const formContainer = document.getElementById("formContainer");
  formContainer.style.display = "block";

  // Send a request to the server to retrieve the character ID
  fetch(`/api/characters/find`, {
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
        throw new Error("Error finding character.");
      }
    })
    .then((data) => {
      // Extract the character ID from the response data
      const characterId = data.characterId;

      // Create the form and populate it with the character data
      const form = document.createElement("form");
      form.id = "updateForm";
      form.innerHTML = `
          <label for="charName">Name:</label>
          <input type="text" id="charName" name="charName" value="${charName}"><br>
          
          <label for="charLevel">Level:</label>
          <input type="number" id="charLevel" name="charLevel" value="${charLevel}"><br>
          
          <label for="charClass">Class:</label>
          <select id="charClass" name="charClass">
          <option value="Druid" ${
            charClass === "Druid" ? "selected" : ""
          }>Druid</option>
          <option value="Sorceress" ${
            charClass === "Sorceress" ? "selected" : ""
          }>Sorceress</option>
          <option value="Necromancer" ${
            charClass === "Necromancer" ? "selected" : ""
          }>Necromancer</option>
          <option value="Rogue" ${
            charClass === "Rogue" ? "selected" : ""
          }>Rogue</option>
          <option value="Barbarian" ${
            charClass === "Barbarian" ? "selected" : ""
          }>Barbarian</option>
          </select>
          <br>
        
          <button type="submit">Update Character</button>
        `;

      // Attach the submit event listener to the form
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedCharacterData = {
          characterId: characterId, // Use the retrieved character ID
          char_name: form.charName.value,
          char_level: form.charLevel.value,
          char_class: form.charClass.value,
        };

        // Send the updated character data to the server
        fetch(`/api/characters/${characterId}`, {
          // Use the retrieved character ID in the URL
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCharacterData),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the server response or perform any necessary actions
            console.log("Server response:", data);
          })
          .catch((error) => {
            // Handle any errors that occurred during the server request
            console.error("Error:", error);
          });
      });

      // Append the form to the document
      formContainer.innerHTML = ""; // Clear previous form, if any
      formContainer.appendChild(form);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Attach click event handlers to the update buttons
const updateButtons = document.querySelectorAll(".updateButton");
updateButtons.forEach((button) => {
  button.addEventListener("click", handleUpdate);
});

// Function to handle the delete button click
function handleDelete(event) {
  const characterDiv = event.target.closest(".character");
  const charName = characterDiv.querySelector("h2").textContent;
  const charLevel = characterDiv
    .querySelector("p:nth-child(2)")
    .textContent.split(" ")[1];
  const charClass = characterDiv
    .querySelector("p:nth-child(3)")
    .textContent.split(" ")[1];

  const characterData = {
    char_name: charName,
    char_level: charLevel,
    char_class: charClass,
  };

  // Send a request to the server to retrieve the character ID
  fetch(`/api/characters/find`, {
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
        throw new Error("Error finding character.");
      }
    })
    .then((data) => {
      // Extract the character ID from the response data
      const characterId = data.characterId;

      // Call your deleteCharacter function with the retrieved character ID
      deleteCharacter({ characterId: characterId });
      alert("Character Successfully Deleted!");
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
          alert("Character created successfully!");
          return response.json();
        } else {
          throw new Error("Error saving character.");
        }
      })
      .then((data) => {
        const characterDiv = createCharacterDiv(data);
        document.getElementById("characterContainer").appendChild(characterDiv);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
