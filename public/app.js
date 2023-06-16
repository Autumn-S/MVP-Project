document.addEventListener("DOMContentLoaded", function () {
  var createLink = document.getElementById("createLink");
  var updateLink = document.getElementById("updateLink");
  var formBox = document.getElementById("formBox");
  var characterContainer = document.getElementById("characterContainer");

  createLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior

    toggleVisibility(formBox);
    hideElement(characterContainer);

    // Additional logic for the "create" link
  });

  updateLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior

    toggleVisibility(characterContainer);
    hideElement(formBox);

    // Additional logic for the "update" link
    fetch("/api/characters")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Process the retrieved data as needed
      })
      .catch((error) => {
        console.error("Error retrieving characters:", error);
      });
  });

  function toggleVisibility(element) {
    if (element.style.display === "none") {
      element.style.display = "block";
      element.classList.add("centered");
    } else {
      element.style.display = "none";
      element.classList.remove("centered");
    }
  }

  function hideElement(element) {
    element.style.display = "none";
    element.classList.remove("centered");
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
          fetch("/api/characters")
            .then((res) => res.json())
            .then((data) => {
              console.log("characters data", data);
              const characterContainer =
                document.getElementById("characterContainer");

              // Clear the existing character data in the container
              characterContainer.innerHTML = "";

              // Iterate over the character data and create HTML elements for each character
              data.forEach((character) => {
                const characterElement = document.createElement("div");
                characterElement.textContent = `${character.char_name} - Level ${character.char_level} ${character.char_class}`;

                // Append the character element to the container
                characterContainer.appendChild(characterElement);
              });
            });
        } else {
          console.log("Error saving character.");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
