function chooseColor(){
 var selectedColor = document.getElementById("colorInput").value;
 var bodyContent  = document.getElementById("bodyid");
 bodyContent.style.backgroundColor = selectedColor;

 var hexValue = document.getElementById("parag");
 hexValue.innerHTML = "Your current color's value is:" + selectedColor;
}
