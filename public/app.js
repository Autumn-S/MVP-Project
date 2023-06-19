// Function to create a character div
function createCharacterDiv(characterData) {
  const closeButton = createButton("close");
  const characterDiv = createDiv("character");
  const h2 = createHeading("h2", characterData.char_name);
  const p1 = createParagraph(`Level: ${characterData.char_level}`);
  const p2 = createParagraph(`Class: ${characterData.char_class}`);
  const updateButton = createButton("update", "Update");
  updateButton.addEventListener("click", handleUpdate);
  const deleteButton = createButton("delete", "Delete");
  deleteButton.addEventListener("click", handleDelete);

  appendChildren(
    characterDiv,
    closeButton,
    h2,
    p1,
    p2,
    updateButton,
    deleteButton
  );

  return characterDiv;
}

// Helper function to create a button
function createButton(className, text) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.textContent = text;
  return button;
}

// Helper function to create a div
function createDiv(className) {
  const div = document.createElement("div");
  div.classList.add(className);
  return div;
}

// Helper function to create a heading
function createHeading(tagName, text) {
  const heading = document.createElement(tagName);
  heading.textContent = text;
  return heading;
}

// Helper function to create a paragraph
function createParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  return paragraph;
}

// Helper function to append multiple children to a parent element
function appendChildren(parent, ...children) {
  children.forEach((child) => parent.appendChild(child));
}

// Function to toggle visibility of an element
function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  element.style.display = element.style.display === "none" ? "block" : "none";
  element.classList.toggle("centered");
}

// Event listeners for toggle links
document
  .getElementById("aboutLink")
  .addEventListener("click", () => toggleVisibility("aboutContainerBox"));
document
  .getElementById("createLink")
  .addEventListener("click", () => toggleVisibility("formBox"));
document
  .getElementById("displayLink")
  .addEventListener("click", () => toggleVisibility("characterContainerBox"));

// Click event listener to hide div when clicked outside
document.addEventListener("click", function (event) {
  const aboutContainer = document.getElementById("aboutContainerBox");
  const formBox = document.getElementById("formBox");
  const characterContainer = document.getElementById("characterContainerBox");

  const hideElement = (element, link) => {
    if (
      !element.contains(event.target) &&
      event.target !== link &&
      element.style.display === "block"
    ) {
      toggleVisibility(element.id);
    }
  };

  hideElement(aboutContainer, aboutLink);
  hideElement(formBox, createLink);
  hideElement(characterContainer, displayLink);
});

// Functionality for the close buttons
const aboutContainerBox = document.getElementById("aboutContainerBox");
const formBox = document.getElementById("formBox");
const formContainer = document.getElementById("formContainer");
const closeButtonList = document.querySelectorAll("button.close");

closeButtonList.forEach((button) => {
  button.addEventListener("click", () => {
    aboutContainerBox.style.display = "none";
    formBox.style.display = "none";
    formContainer.style.display = "none";
  });
});

// Function to load and display character data
function loadAndDisplayCharacterData() {
  fetch("/api/characters")
    .then((response) => response.json())
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
function deleteCharacter(characterId) {
  fetch(`/api/characters/${characterId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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

// Function to handle the delete button click
function handleDelete(event) {
  const characterDiv = event.target.closest(".character");
  const characterId = characterDiv.dataset.characterId; // Assuming the character ID is stored as a data attribute in the characterDiv
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

  fetch(`/api/characters/find`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
      const characterId = data.characterId;
      deleteCharacter(characterId);
      alert("Character Successfully Deleted!");
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function handleUpdate(event) {
  const formContainer = document.getElementById("formContainer");
  const characterDiv = event.target.closest(".character");
  const characterId = characterDiv.dataset.characterId; // Assuming the character ID is stored as a data attribute in the characterDiv
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

  fetch(`/api/characters/find`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
      const updateForm = createUpdateForm(
        characterId,
        charName,
        charLevel,
        charClass
      );

      updateForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedCharacterData = {
          characterId: characterId,
          char_name: updateForm.charName.value,
          char_level: updateForm.charLevel.value,
          char_class: updateForm.charClass.value,
        };

        fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCharacterData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Server response:", data);
            alert("Character has been updated!");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });

      formContainer.innerHTML = "";
      formContainer.appendChild(updateForm);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Helper function to create the update form
function createUpdateForm(charName, charLevel, charClass) {
  const updateForm = document.createElement("form");
  updateForm.id = "updateForm";
  updateForm.innerHTML = `
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
      </select><br>
    
      <button type="submit">Update Character</button>
    `;

  return updateForm;
}

// Attach click event handlers to the update buttons
const updateButtons = document.querySelectorAll(".updateButton");
updateButtons.forEach((button) => {
  button.addEventListener("click", handleUpdate);
});

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
      headers: { "Content-Type": "application/json" },
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
