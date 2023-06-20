// Function to create a character div
function createCharacterDiv(characterData) {
  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character");

  characterDiv.innerHTML = `
      <h2>${characterData.char_name}</h2>
      <p>Level: ${characterData.char_level}</p>
      <p>Class: ${characterData.char_class}</p>
      <button class="update">Update</button>
      <button class="delete">Delete</button>
      <button class="close"></button>
    `;

  return characterDiv;
}

// Function to toggle visibility of an element
function toggleVisibility(element) {
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

// Function to hide element when clicked outside
function hideOnClickOutside(element, link) {
  document.addEventListener("click", function (event) {
    if (
      !element.contains(event.target) &&
      event.target !== link &&
      element.style.display === "block"
    ) {
      toggleVisibility(element);
    }
  });
}

// Function to load and display character data
async function loadAndDisplayCharacterData() {
  try {
    const res = await fetch("/api/characters");
    const data = await res.json();

    const characterContainer = document.getElementById("characterContainer");
    characterContainer.innerHTML = "";

    data.forEach((character) => {
      const characterDiv = createCharacterDiv(character);
      characterContainer.appendChild(characterDiv);
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function to delete a character
async function deleteCharacter(characterId) {
  try {
    const response = await fetch(`/api/characters/${characterId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Character deleted successfully!");
    } else {
      console.log("Error deleting character.");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function to update a character
async function updateCharacter(characterId, updatedCharacterData) {
  try {
    const response = await fetch(`/api/characters/${characterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCharacterData),
    });

    const data = await response.json();
    console.log("Server response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to handle update button click
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

  fetchCharacterId(characterData)
    .then((characterId) => {
      const updateForm = createUpdateForm(characterId, characterData);
      const formContainer = document.getElementById("formContainer");
      formContainer.innerHTML = "";
      formContainer.appendChild(updateForm);
      toggleVisibility(formContainer);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to fetch character ID
async function fetchCharacterId(characterData) {
  const response = await fetch(`/api/characters/find`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(characterData),
  });

  if (!response.ok) {
    throw new Error("Error finding character.");
  }

  const data = await response.json();
  return data.characterId;
}

// Function to create update form
function createUpdateForm(characterId, characterData) {
  const updateForm = document.createElement("form");
  updateForm.id = "updateForm";
  updateForm.innerHTML = `
      <button class="close"></button>
      <br>
      <label for="charName">Name:</label>
      <input type="text" id="charName" name="charName" value="${
        characterData.char_name
      }"><br>
      <label for="charLevel">Level:</label>
      <input type="number" id="charLevel" name="charLevel" value="${
        characterData.char_level
      }"><br>
      <label for="charClass">Class:</label>
      <select id="charClass" name="charClass">
        <option value="Druid" ${
          characterData.char_class === "Druid" ? "selected" : ""
        }>Druid</option>
        <option value="Sorceress" ${
          characterData.char_class === "Sorceress" ? "selected" : ""
        }>Sorceress</option>
        <option value="Necromancer" ${
          characterData.char_class === "Necromancer" ? "selected" : ""
        }>Necromancer</option>
        <option value="Rogue" ${
          characterData.char_class === "Rogue" ? "selected" : ""
        }>Rogue</option>
        <option value="Barbarian" ${
          characterData.char_class === "Barbarian" ? "selected" : ""
        }>Barbarian</option>
      </select>
      <br>
      <button type="submit">Update Character</button>
    `;

  updateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedCharacterData = {
      characterId: characterId,
      char_name: updateForm.charName.value,
      char_level: updateForm.charLevel.value,
      char_class: updateForm.charClass.value,
    };

    updateCharacter(characterId, updatedCharacterData)
      .then(() => {
        const formContainer = document.getElementById("formContainer");
        toggleVisibility(formContainer);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  return updateForm;
}

// Function to handle delete button click
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

  fetchCharacterId(characterData)
    .then((characterId) => {
      return deleteCharacter(characterId);
    })
    .then(() => {
      alert("Character deleted successfully!");
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to delete character
async function deleteCharacter(characterId) {
  const response = await fetch(`/api/characters/${characterId}`, {
    method: "DELETE",
    body: JSON.stringify({ characterId: characterId }),
  });

  if (!response.ok) {
    throw new Error("Error deleting character.");
  }
}

// Function to load and display character data
async function loadAndDisplayCharacterData() {
  try {
    const res = await fetch("/api/characters");
    const data = await res.json();

    const characterContainer = document.getElementById("characterContainer");
    characterContainer.innerHTML = "";

    data.forEach((character) => {
      const characterDiv = createCharacterDiv(character);
      characterContainer.appendChild(characterDiv);
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function to create character div
function createCharacterDiv(characterData) {
  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character");

  characterDiv.innerHTML = `
      <h2>${characterData.char_name}</h2>
      <p>Level: ${characterData.char_level}</p>
      <p>Class: ${characterData.char_class}</p>
      <button class="update">Update</button>
      <button class="delete">Delete</button>
      <button class="close"></button>
    `;

  const updateButton = characterDiv.querySelector(".update");
  updateButton.addEventListener("click", function (event) {
    event.stopPropagation();
    handleUpdate(characterData); // Pass the character data to the handleUpdate function
  });

  characterDiv.querySelector(".delete").addEventListener("click", handleDelete);

  return characterDiv;
}

// Function to toggle visibility of an element
function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

// Function to add event listener for toggle link
function addToggleListener(linkId, elementId) {
  const link = document.getElementById(linkId);
  link.addEventListener("click", function () {
    toggleVisibility(elementId);
  });
}

// Function to hide element when clicked outside
function hideOnClickOutside(elementId, linkId) {
  document.addEventListener("click", function (event) {
    const element = document.getElementById(elementId);
    const link = document.getElementById(linkId);

    if (
      !element.contains(event.target) &&
      event.target !== link &&
      element.style.display === "block"
    ) {
      toggleVisibility(elementId);
    }
  });
}

// Event listeners for toggle links
addToggleListener("aboutLink", "aboutContainerBox");
addToggleListener("createLink", "formBox");
addToggleListener("displayLink", "characterContainerBox");

// Click event listeners to hide divs when clicked outside
hideOnClickOutside("aboutContainerBox", "aboutLink");
hideOnClickOutside("formBox", "createLink");
hideOnClickOutside("characterContainerBox", "displayLink");

// Functionality for the close buttons
const closeButtonList = document.querySelectorAll(".close");
closeButtonList.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    const parentDiv = event.target.parentElement;
    toggleVisibility(parentDiv.id);
  });
});

// Load and display character data
loadAndDisplayCharacterData();
