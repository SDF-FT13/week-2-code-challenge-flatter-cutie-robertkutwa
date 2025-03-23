const BASE_URL = "http://localhost:3000/characters";

const characterBar = document.getElementById("character-bar");
const nameDisplay = document.getElementById("name");
const imageDisplay = document.getElementById("image");
const voteCount = document.getElementById("vote-count");
const voteForm = document.getElementById("votes-form");
const resetButton = document.getElementById("reset-btn");
const newCharacterForm = document.getElementById("character-form");

let currentCharacter = null;

function fetchCharacters() {
  fetch(BASE_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch characters");
      return res.json();
    })
    .then((characters) => characters.forEach(renderCharacterSpan))
    .catch((error) => {
      console.error("Error fetching characters:", error);
      alert("Failed to load characters. Please try again later.");
    });
}

function renderCharacterSpan(character) {
  const span = document.createElement("span");
  span.textContent = character.name;
  span.style.cursor = "pointer";
  span.addEventListener("click", () => showCharacter(character));
  characterBar.appendChild(span);
}

function showCharacter(character) {
  currentCharacter = character;
  nameDisplay.textContent = character.name;
  imageDisplay.src = character.image;
  imageDisplay.alt = character.name;
  voteCount.textContent = character.votes;
}

function updateVotes(id, votes) {
  fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update votes");
      return res.json();
    })
    .then((updatedCharacter) => {
      currentCharacter.votes = updatedCharacter.votes;
      voteCount.textContent = updatedCharacter.votes;
    })
    .catch((error) => {
      console.error("Error updating votes:", error);
      alert("Failed to update votes. Please try again.");
    });
}

voteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const addedVotes = parseInt(e.target.votes.value, 10);
  if (!isNaN(addedVotes) && addedVotes >= 0 && currentCharacter) {
    const newVoteTotal = currentCharacter.votes + addedVotes;
    updateVotes(currentCharacter.id, newVoteTotal);
  } else {
    alert("Please enter a valid number of votes.");
  }
  e.target.reset();
});

resetButton.addEventListener("click", () => {
  if (currentCharacter) {
    currentCharacter.votes = 0;
    voteCount.textContent = 0;
    updateVotes(currentCharacter.id, 0);
  }
});

if (newCharacterForm) {
  newCharacterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const image = e.target["image-url"].value.trim();
    if (name && image) {
      const newCharacter = { name, image, votes: 0 };
      fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharacter),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to add character");
          return res.json();
        })
        .then((savedCharacter) => {
          renderCharacterSpan(savedCharacter);
          showCharacter(savedCharacter);
        })
        .catch((error) => {
          console.error("Error adding character:", error);
          alert("Failed to add character. Please try again.");
        });
      e.target.reset();
    } else {
      alert("Please fill out all fields.");
    }
  });
}

fetchCharacters();