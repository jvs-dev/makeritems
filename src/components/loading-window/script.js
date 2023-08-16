let PageLoadingWindow = document.getElementById("PageLoadingWindow")


function windowLoaded() {
    setTimeout(() => {
        PageLoadingWindow.style.opacity = "0"
        setTimeout(() => {
            PageLoadingWindow.style.display = "none"
        }, 200);
    }, 2000);
}

window.addEventListener("load", windowLoaded())