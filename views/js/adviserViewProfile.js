let menu = document.querySelector("#menu");
let nav = document.querySelector(".navcontainer");

menu.addEventListener("click", () => {
    nav.classList.toggle("navclose");
    menu.classList.toggle("change");
})

let navOptions = document.querySelectorAll(".nav-option");

navOptions.forEach((option) => {
    option.addEventListener("click", () => {
        if (option.classList.contains("optionDashboard")) {
            window.location.href = "adviserDashboard.html";
        } else if (option.classList.contains("optionStudManage")) {
            window.location.href = "teacherStudents.html";
        } else if (option.classList.contains("optionSection")) {
            window.location.href = "adviserSection.html";
        } else if (option.classList.contains("optionCategory")) {
            window.location.href = "teacherCategories.html";
        } else if (option.classList.contains("optionRequest")) {
            window.location.href = "teacherRequests.html";
        }
    });
});

function refreshPage() {
    location.reload();
}