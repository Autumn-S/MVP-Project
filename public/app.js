document.getElementById("createLink").addEventListener("click", function () {
  const formBox = document.getElementById("formBox");
  if (formBox.style.display === "none") {
    formBox.style.display = "block";
    formBox.classList.add("centered");
  } else {
    formBox.style.display = "none";
    formBox.classList.remove("centered");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const updateLink = document.getElementById("updateLink");
  updateLink.addEventListener("click", function () {
    loadAndDisplayCharacterData();
    toggleVisibility();
  });

  function loadAndDisplayCharacterData() {
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => {
        const characterContainer =
          document.getElementById("characterContainer");

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

  function toggleVisibility() {
    const characterContainerBox = document.getElementById(
      "characterContainerBox"
    );
    if (characterContainerBox.style.display === "none") {
      characterContainerBox.style.display = "block";
      characterContainerBox.classList.add("centered");
    } else {
      characterContainerBox.style.display = "none";
      characterContainerBox.classList.remove("centered");
    }
  }

  function updateCharacter(character) {
    // Implement your update logic here
    console.log("Update character:", character);
  }

  function deleteCharacter(character) {
    // Implement your delete logic here
    console.log("Delete character:", character);
  }
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
