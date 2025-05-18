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
        if (option.classList.contains("optionStat")) {
            let dropdownContainer = option.querySelector(".dropdown-container");
            dropdownContainer.style.display = dropdownContainer.style.display === "block" ? "none" : "block";
            option.classList.toggle("active");
        } else if (option.classList.contains("optionDashboard")) {
            window.location.href = "adminDashboard.html";
        } else if (option.classList.contains("optionCapstone")) {
            window.location.href = "adminCapstones.html";
        } else if (option.classList.contains("optionCategory")) {
            window.location.href = "coorCategories.html";
        } else if (option.classList.contains("optionAccount")) {
            optionAccount.classList.toggle("active");
            let dropdownContainer = option.querySelector(".dropdown-container");
            dropdownContainer.style.display = dropdownContainer.style.display === "block" ? "none" : "block";
        } else if (option.classList.contains("optionRequest")) {
            window.location.href = "adminListofRequests.html";
          }
    });
});

let currentPage = window.location.href;
let statPages = ["adminListofCapstones.html"];

let matchedPage;
if (statPages.some(page => {
    if (currentPage.includes(page)) {
        matchedPage = page;
        return true;
    }
})) {
    let dropdownContainer = optionStat.querySelector(".dropdown-container");
    dropdownContainer.style.display = "block";
    let selectedItem = dropdownContainer.querySelector(`a[href="${matchedPage}"]`);
    if (selectedItem) {
        selectedItem.classList.add("active");
        optionStat.classList.add("active");
    }
}

let dropdownLinks = document.querySelectorAll(".dropdown-container a");
dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
        let dropdownContainer = link.closest(".dropdown-container");
        let activeLink = dropdownContainer.querySelector(".active");
        if (activeLink) {
            activeLink.classList.remove("active");
        }
        link.classList.add("active");
    });
});

function refreshPage() {
    window.location.reload(window.location.href);
}