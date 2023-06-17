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
function deleteCharacter(characterData) {
  fetch(`/api/characters/${characterData.id}`, {
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
function updateCharacter(characterData) {
  fetch(`/api/characters/${characterData.id}`, {
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

// Function to handle the update button click
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

  // Call your updateCharacter function with the characterData
  updateCharacter(characterData);
}

//function to handle the delete event
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
      const characterId = data;

      // Call your deleteCharacter function with the retrieved character ID
      deleteCharacter({ id: characterId });
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
          alert("Character Created Successfully!");
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
