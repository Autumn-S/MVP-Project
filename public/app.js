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
            });
        } else {
          console.log("Error saving character.");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
