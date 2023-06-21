// Function to create a character div element
function createCharacterDiv(characterData) {
  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character");

  const characterName = document.createElement("h2");
  characterName.textContent = characterData.char_name;
  characterDiv.appendChild(characterName);

  const characterLevel = document.createElement("p");
  characterLevel.textContent = "Level: " + characterData.char_level;
  characterDiv.appendChild(characterLevel);

  const characterClass = document.createElement("p");
  characterClass.textContent = "Class: " + characterData.char_class;
  characterDiv.appendChild(characterClass);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete");
  characterDiv.appendChild(deleteButton);

  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.classList.add("update");
  characterDiv.appendChild(updateButton);

  return characterDiv;
}

// Function to handle character deletion
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

    const response = await fetch("/api/characters/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    });

    if (response.ok) {
      const data = await response.json();
      const characterId = data.characterId;

      await deleteCharacter(characterId);
      characterDiv.remove(); // Remove the deleted character from the UI
    } else {
      throw new Error("Error finding character.");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function to handle character update
async function handleUpdate(event) {
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

// Function to retrieve character ID
async function retrieveCharacterId(characterData) {
  try {
    const response = await fetch("/api/characters/find", {
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

// Function to handle character update form submission
async function handleUpdateFormSubmission(characterId) {
  const form = document.getElementById("updateForm");
  const charName = form.querySelector("#charName").value;
  const charLevel = form.querySelector("#charLevel").value;
  const charClass = form.querySelector("#charClass").value;

  const updatedCharacterData = {
    char_name: charName,
    char_level: charLevel,
    char_class: charClass,
  };

  try {
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

    form.style.display = "none";
    alert("Character updated successfully!");
  } catch (error) {
    console.log("Error:", error);
  }
}

// Event delegation for delete and update buttons
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("delete")) {
    await handleDelete(event);
  }

  if (event.target.classList.contains("update")) {
    await handleUpdate(event);
  }
});

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
        document.getElementById("characterForm").reset();
      } else {
        console.log("Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  });
