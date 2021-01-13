setInterval(setClock, 1000) 

const hourHand = document.querySelector("[data-hour-hand]");
const minuteHand = document.querySelector("[data-minute-hand]");
const secondHand = document.querySelector("[data-second-hand]");

function setClock(){
    const currentDate = new Date();   //it gives the current time that you been in
    const secondsRatio = currentDate.getSeconds() / 60; //takes the seconds of current date and adds 60 piece of sec because there are 60 sec in a minute
    const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60; //we added seconds because minutes have to go with secs
    const hoursRatio = (minutesRatio + currentDate.getHours()) / 12;

    setRotation(hourHand, hoursRatio);
    setRotation(minuteHand, minutesRatio);
    setRotation(secondHand, secondsRatio);
}

function setRotation(element, rotationRadio){
    element.style.setProperty("--rotation", rotationRadio * 360);

}

setClock();