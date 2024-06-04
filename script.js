/*
Notification.requestPermission().then(perm => {
    if (perm === "granted") {
        const notification = new Notification("Test", {
            body: "Hello",
        })

        notification.addEventListener("click", e => {
            window.open("https://google.com")
        })
    }
})
*/

let hamburgerButtons = document.querySelector("#hamburgerButtons")
document.querySelector("#hamburger").addEventListener("click", function () {
    if (hamburgerButtons.style.display == "none" || hamburgerButtons.style.display == "") {
        hamburgerButtons.style.display = "block"
    } else {
        hamburgerButtons.style.display = "none"
    }
})

let listItems = document.querySelectorAll(".item")

for (let index = 0; index < listItems.length; index++) {
    const item = listItems[index];
    let value = item.getAttribute("redirect-url")
    if (value != null && value != "") {
        item.addEventListener("click", function () {
            window.location.href = value
        })
    }
}