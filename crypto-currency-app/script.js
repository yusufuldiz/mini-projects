const GETDATA = async () => {

    const RESPONSE = await fetch("https://api.coincap.io/v2/assets/");
    const responseJSON = await RESPONSE.json();
    const allCurrencies = Object.keys(responseJSON.data);
  
    for(let i = 0; i< allCurrencies.length; i++){
    let exactCurrency = responseJSON.data[i];
    //console.log(exactCurrency.name + " " + exactCurrency.priceUsd);
    const CoinTable = document.querySelector("#coinTable");
    let coinTR = document.createElement("tr");
  
    let coinIdTD = document.createElement("td");
    coinIdTD.textContent = exactCurrency.symbol;
    coinTR.appendChild(coinIdTD);
       
    let coinNameTD = document.createElement("td");
    coinNameTD.textContent = exactCurrency.name;
    coinTR.appendChild(coinNameTD);
  
    let coinValueTD = document.createElement("td");
    coinValueTD.textContent = `$ ${exactCurrency.priceUsd}`;
    coinTR.appendChild(coinValueTD);
  
    CoinTable.appendChild(coinTR);
  
    } 
  }
  
  GETDATA();
  