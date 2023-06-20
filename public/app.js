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
const aboutContainerBox = document.getElementById("aboutContainerBox");
const formBox = document.getElementById("formBox");
const closeButtonList = document.querySelectorAll("button.close");

closeButtonList.forEach((button) => {
  button.addEventListener("click", () => {
    aboutContainerBox.style.display = "none";
    formBox.style.display = "none";
  });
});

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
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
      } else {
        console.log("Response content is not JSON:", await response.text());
      }

      alert("Character deleted successfully!");
      location.reload();
    } else {
      console.log("Error deleting character.");
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
    // Send a request to the server to retrieve the character ID
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
    const characterId = data.characterId;

    // Create the form and populate it with the character data
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

    // Attach the submit event listener to the form
    updateForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const updatedCharacterData = {
        characterId: characterId, // Use the retrieved character ID
        char_name: updateForm.charName.value,
        char_level: updateForm.charLevel.value,
        char_class: updateForm.charClass.value,
      };

      try {
        // Send the updated character data to the server
        const response = await fetch(`/api/characters/${characterId}`, {
          // Use the retrieved character ID in the URL
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCharacterData),
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            // Handle the server response or perform any necessary actions
            alert("Character updated successfully!");
            location.reload();
            console.log("Server response:", data);

            // Clear and hide the form
            formContainer.innerHTML = "";
            formContainer.style.display = "none";
          } else {
            console.log("Error updating character.");
          }
        }
        // Append the form to the document
        formContainer.innerHTML = ""; // Clear previous form, if any
        formContainer.appendChild(updateForm);
      } catch (error) {
        console.error("Error:", error);
      }
    });

    // Append the form to the document
    formContainer.innerHTML = ""; // Clear previous form, if any
    formContainer.appendChild(updateForm);
  } catch (error) {
    console.log("Error:", error);
  }
}

// Attach click event handlers to the update buttons
const updateButtons = document.querySelectorAll(".updateButton");
updateButtons.forEach((button) => {
  button.addEventListener("click", function () {
    if (!formContainer.classList.contains("open")) {
      handleUpdate();
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
          alert("Character created successfully!");
          console.log("Response content is not JSON:", await response.text());
        }

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
