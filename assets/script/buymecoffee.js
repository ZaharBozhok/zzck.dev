function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
    return false;
}

{
    let coffee = document.getElementById("buymecoffeediv")
    if (isMobile()) {
        coffee.classList.add("mobile")
    }
}