let menu = document.querySelector("#menu");
let nav = document.querySelector(".navcontainer");

menu.addEventListener("click", () => {
  nav.classList.toggle("navclose");
  menu.classList.toggle("change");
})

let navOptions = document.querySelectorAll(".nav-option");
let optionAccount = document.querySelector(".optionAccount");
let optionStat = document.querySelector(".optionStat");
let isDropdownOpen = false;

navOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.classList.contains("optionActive")) {
      window.location.reload();
    } else if (option.classList.contains("optionDashboard")) {
      window.location.href = "adminDashboard.html";
    } else if (option.classList.contains("optionAccount")) {
      if (!isDropdownOpen) {
        option.classList.add("active");
        isDropdownOpen = true;
      } else {
        option.classList.remove("active");
        isDropdownOpen = false;
      }
      let dropdownContainer = option.querySelector(".dropdown-container");
      dropdownContainer.style.display = dropdownContainer.style.display === "block" ? "none" : "block";
    } else if (option.classList.contains("optionCategory")) {
      window.location.href = "coorCategories.html";
    } else if (option.classList.contains("optionStat")) {
      if (!isDropdownOpen) {
        option.classList.add("active");
        isDropdownOpen = true;
      } else {
        option.classList.remove("active");
        isDropdownOpen = false;
      }
      let dropdownContainer = option.querySelector(".dropdown-container");
      dropdownContainer.style.display = dropdownContainer.style.display === "block" ? "none" : "block";
    } else if (option.classList.contains("optionRequest")) {
      window.location.href = "adminListofRequests.html";
    }
  });
});

let dropdownLinks = document.querySelectorAll(".dropdown-container a");
dropdownLinks.forEach((link) => {
  link.addEventListener("click", () => {
    let dropdownContainer = link.closest(".dropdown-container");
    dropdownContainer.style.display = "none";
    optionStat.classList.remove("active");
    isDropdownOpen = false;
  });
});

function refreshPage() {
  location.reload();
}

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}