import data from "./data.js"
import {createTableElements} from "./main.js";

/*
  ALWAYS USE IMPORTED data ARRAY TO MAKE MANIPULATIONS

  ID for allcities table is #allcities
  ID for singlecity table is #singlecity
/*

/*
* PASS ARRAY TO createTableElements function to fill tables
* first argument - data
* second argument - tableId
* Example createTableElements([{name: "Istanbul"}], "allcities");
*/

/*
    ids for buttons and select

    Population - bigger than 500.000 => #populationBigger
    land area - less than 1000 => #landAreaLess
    Does any city has population less than 100.000? => #isPopulationLess
    Does every city has land area bigger than 100? => #isLandBigger
    city select => #selectcity
*/

/* RESET ACTION */
document.querySelector("#reset").addEventListener("click", () => {
    createTableElements(data, "allcities");
    createTableElements([], "singlecity")
});

/* START CODING HERE */


document.querySelector("#populationBigger").addEventListener("click", () => {
  const biggerThan500k = data.filter(deger => deger.location == "Manchester");
  createTableElements(biggerThan500k,"allcities");
});

document.querySelector("#landAreaLess").addEventListener("click", () => {
  const lessThan1000 = data.filter(deger => deger.championship >= 10);
  createTableElements(lessThan1000,"allcities");
});

document.querySelector("#isPopulationLess").addEventListener("click", () => {
  const isAnyLess = data.some(deger => deger.location == "London");
  alert(isAnyLess ? "Yes" : "No");
});
document.querySelector("#isLandBigger").addEventListener("click", () => {
  const isEveryBig = data.every(deger => deger.championship >= 1);
  alert(isEveryBig ? "Yes" : "No");
});


//----------------

const cityForm = document.querySelector("#inputGroupSelect01");
for (let i = 0; i <= cityForm.length; i++) {
  let defaultOptions = document.querySelector("option[value]")
  cityForm.removeChild(defaultOptions)
} 


//options added

data.forEach((deger) => {

let selecting = document.createElement("option");
let addCity = document.createTextNode(deger.name);
selecting.appendChild(addCity);

cityForm.appendChild(selecting);

}); 

//------------------

cityForm.addEventListener("change", (e) => {
  let selectedCity = data.find(element => e.target.value === element.name)
  createTableElements([selectedCity], "singlecity")
})