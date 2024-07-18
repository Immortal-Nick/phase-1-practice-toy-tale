let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();
  handleFormSubmit();
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });
}

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeButton = div.querySelector(".like-btn");
  likeButton.addEventListener("click", () => {
    increaseLikes(toy);
  });

  toyCollection.appendChild(div);
}

function handleFormSubmit() {
  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        renderToy(toy);
        form.reset();
      });
  });
}

function increaseLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.getElementById(toy.id).parentElement;
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}