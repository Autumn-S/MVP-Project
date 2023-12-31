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

  characterDiv.querySelector(".update").addEventListener("click", handleUpdate);
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
const closeButtonList = document.querySelectorAll("button.close");

closeButtonList.forEach((button) => {
  button.addEventListener("click", () => {
    toggleVisibility(button.closest(".container").id);
  });
});

// Function to refresh character container
function refreshCharacterContainer() {
  const characterContainerBox = document.getElementById(
    "characterContainerBox"
  );
  characterContainerBox.innerHTML = ""; // Clear existing content

  // Fetch and render the characters again
  fetch("/api/characters")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((character) => {
        const characterDiv = createCharacterDiv(character);
        characterContainerBox.appendChild(characterDiv);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Add event listener to characterContainerBox
const characterContainerBox = document.getElementById("characterContainerBox");
characterContainerBox.addEventListener("change", refreshCharacterContainer);

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

async function deleteCharacter(characterData) {
  try {
    const response = await fetch(
      `/api/characters/${characterData.characterId}`,
      {
        method: "DELETE",
        body: JSON.stringify(characterData),
      }
    );

    if (response.ok) {
      alert("Character deleted successfully!");
      // Reload the page
      location.reload();
    } else {
      throw new Error("Error deleting character.");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

async function handleUpdate(event) {
  const formContainer = document.getElementById("formContainer");
  formContainer.style.display =
    formContainer.style.display === "none" ? "block" : "none";
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

  try {
    const characterId = await retrieveCharacterId(characterData);

    if (characterId) {
      createUpdateForm(characterId, charName, charLevel, charClass);
    } else {
      throw new Error("Error finding character ID.");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

async function retrieveCharacterId(characterData) {
  try {
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
  } catch (error) {
    throw new Error("Error retrieving character ID.");
  }
}

function createUpdateForm(characterId, charName, charLevel, charClass) {
  const formContainer = document.getElementById("formContainer");

  const updateForm = document.createElement("form");
  updateForm.id = "updateForm";
  updateForm.innerHTML = `
      <button class="close"></button>
      <br>
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

  updateForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedCharacterData = {
      characterId: characterId,
      char_name: updateForm.charName.value,
      char_level: updateForm.charLevel.value,
      char_class: updateForm.charClass.value,
    };

    const response = await fetch(`/api/characters/${characterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCharacterData),
    });

    if (!response.ok) {
      console.error("Error updating character.");
      return;
    }

    formContainer.style.display = "none";
    alert("Character updated successfully!");
  });

  const closeButton = updateForm.querySelector(".close");
  closeButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    formContainer.style.display = "none";
  });

  formContainer.innerHTML = "";
  formContainer.appendChild(updateForm);
}

// Attach click event handlers to the update buttons
const updateButtons = document.querySelectorAll(".updateButton");
updateButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    if (!formContainer.classList.contains("open")) {
      handleUpdate(event); // Pass the event parameter to handleUpdate()
      formContainer.classList.add("open");
    }
  });
});

// Event delegation for close buttons
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("close")) {
    const closeButton = event.target;
    const updateForm = closeButton.closest("#updateForm");
    const characterBox = closeButton.closest(".character");

    if (updateForm) {
      updateForm.style.display = "none";
    }

    if (characterBox) {
      characterBox.style.display = "none";
    }
  }
});

// Function to handle the delete button click
async function handleDelete(event) {
  try {
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
    const response = await fetch(`/api/characters/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    });

    if (response.ok) {
      const data = await response.json();
      // Extract the character ID from the response data
      const characterId = data.characterId;

      // Call the deleteCharacter function with the retrieved character ID
      await deleteCharacter({ characterId: characterId });
    } else {
      throw new Error("Error finding character.");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function to handle form submission
document
  .getElementById("characterForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const charName = document.getElementById("charName").value;
    const charLevel = document.getElementById("charLevel").value;
    const charClass = document.getElementById("charClass").value;

    const characterData = {
      char_name: charName,
      char_level: charLevel,
      char_class: charClass,
    };

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(characterData),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          const characterDiv = createCharacterDiv(data);
          document
            .getElementById("characterContainer")
            .appendChild(characterDiv);
        } else {
          console.log(await response.text());
        }

        alert("Character created successfully!");
        // Clear the form
        document.getElementById("charName").value = "";
        document.getElementById("charLevel").value = "";
        document.getElementById("charClass").value = "";
      } else {
        console.log("Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  });
