let menu = document.querySelector("#menu");
let nav = document.querySelector(".navcontainer");

function myFunction(menu) {
  let nav = document.querySelector(".navcontainer");
  nav.classList.toggle("navclose");
  menu.classList.toggle("change");
}

let navOptions = document.querySelectorAll(".nav-option");

navOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.classList.contains("optionActive")) {
      window.location.reload();
    } else if (option.classList.contains("optionDashboard")) {
      window.location.href = "adviserDashboard.html";
    } else if (option.classList.contains("optionStudManage")) {
      window.location.href = "teacherStudents.html";
    } else if (option.classList.contains("optionSection")) {
      window.location.href = "adviserSection.html";
    } else if (option.classList.contains("optionRequest")) {
      window.location.href = "teacherRequests.html";
    } 
  });
});