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

var hamburgerButtons = document.querySelector("#hamburgerButtons")
document.querySelector("#hamburger").addEventListener("click", function () {
    if (hamburgerButtons.style.display == "none" || hamburgerButtons.style.display == "") {
        hamburgerButtons.style.display = "block"
    } else {
        hamburgerButtons.style.display = "none"
    }
})