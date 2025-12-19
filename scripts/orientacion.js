const topPanel = document.getElementById("topPlane" + idPaneles);
const botPanel = document.getElementById("botPlane" + idPaneles);

screen.orientation.addEventListener("change", (e) => {
    const type = e.target.type;
    if(type === "portrait-primary" || type === "portrait-secondary"){
        topPanel.setAttribute("position", "0 0 -0.75");
        botPanel.setAttribute("position", "0 0 1.5");
    } else {
        topPanel.setAttribute("position", "2 0 0");
        botPanel.setAttribute("position", "-2 0 0")
    }
})