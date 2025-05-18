let menu = document.querySelector("#menu");
let nav = document.querySelector(".navcontainer");

menu.addEventListener("click", () => {
  nav.classList.toggle("navclose");
  menu.classList.toggle("change");
})

let navOptions = document.querySelectorAll(".nav-option");

navOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.classList.contains("optionActive")) {
      window.location.reload();
    } else if (option.classList.contains("optionDashboard")) {
      window.location.href = "adminDashboard.html";
    } else if (option.classList.contains("optionAccount")) {
      window.location.href = "adminAccounts.html";
    } else if (option.classList.contains("optionCapstone")) {
      window.location.href = "adminCapstones.html";
    }
  });
})