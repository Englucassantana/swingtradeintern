let dictComando = {
  
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          carregarValoresMaximoEMinimo();
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
          resetarCampos();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

let xhr = new XMLHttpRequest();
let responsealvo;
let listaDeSimbolos = [];

xhr.onload = function () {
  if (xhr.status == 200) {
    responsealvo = JSON.parse(xhr.responseText);
    for (let i = 0; i < responsealvo.length; i++) {
      listaDeSimbolos.push(responsealvo[i].symbol);
    }
    console.log(listaDeSimbolos);
    autocomplete(document.getElementById("myInput"), listaDeSimbolos);
  }
}
xhr.open('GET', "https://api.binance.com/api/v3/ticker/price", true);
// xhr.open('GET',"https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", true);
xhr.send(null);

document.addEventListener("DOMContentLoaded",()=> {
  //GERAR COMANDO
  let gerarComando = document.getElementById("gerar-comando");
  gerarComando.addEventListener("click", (event) => {
    event.preventDefault();
    dictComando = {};
    const pair = document.getElementById('myInput');
    const entryMin = document.getElementsByClassName('valor-minimo-entrada')[0];
    const entryMax = document.getElementsByClassName('valor-maximo-entrada')[0];
    const alvo = document.getElementsByClassName('alvo');
    const stoploss = document.getElementsByClassName('stop-loss')[0];
    const isHighRisk = document.getElementById('isHighRisk');
    const internId = document.getElementById('intern-id');

    dictComando.internId = internId.value;
    dictComando.pair = pair.value;
    dictComando.entryMin = entryMin.valueAsNumber;
    dictComando.entryMax = entryMax.valueAsNumber;
    for (const key in alvo) {
      if (Object.hasOwnProperty.call(alvo, key)) {
      const target = alvo[key];
      const numberKey = parseInt(key) + 1;
      if(target.valueAsNumber){
        dictComando[`target${numberKey}`] = target.valueAsNumber;
      }                        
      }
    }
    dictComando.stoploss = stoploss.valueAsNumber;
    dictComando.isHighRisk = isHighRisk.checked;
    let jsonComando = JSON.stringify(dictComando)
    console.log(jsonComando);
    comando.innerText = jsonComando;
    navigator.clipboard.writeText(jsonComando);
    alert("Comando copiado para a área de transferência");
  });

  //Valor Maximo de Entrada
  let valorDoAtivo = 0;
  let intervaloDeEntrada = document.getElementById('intervalo-de-entrada');
  intervaloDeEntrada.addEventListener('input', ()=>{
    valorDoAtivo = document.getElementsByClassName("valor-maximo-entrada")[0].value;
    valorDoAtivo = Number(valorDoAtivo);
    console.log("valor Máximo de Entrada:" + valorDoAtivo);
    atualizarAlvos(valorDoAtivo);
    // let alvo = document.getElementsByClassName('alvo');
    // for (let i = 0; i < alvo.length; i++){
    //     let lucro = 100*(alvo[i].value - valorDoAtivo)/valorDoAtivo;
    //     let lucroAlvo = alvo[i].nextElementSibling;
    //     lucroAlvo.innerText = lucro.toFixed(2) + "%";
    //     // atualizarCorAlvos(lucro, lucroAlvo)
    //
    // }
    atualizarStop(valorDoAtivo);
    // let stopLoss = document.getElementsByClassName('stop-loss');
    // for (let i = 0; i < stopLoss.length; i++){
    //     let prejuizo = 100*(stopLoss[i].value - valorDoAtivo)/valorDoAtivo;
    //     let prejuizoStopLoss = stopLoss[i].nextElementSibling;
    //     prejuizoStopLoss.innerText = prejuizo.toFixed(2) + "%";
    //     // atualizarCorStop(prejuizo,prejuizoStopLoss)
    // }
  })
  //CALCULAR ALVO

  // let valorDoAtivo = document.getElementsByClassName("valor-maximo-entrada")[0].value;
  // valorDoAtivo:number = Number(valorDoAtivo);
  let alvos = document.getElementById("alvos");
  alvos.addEventListener('input',()=>{
    console.log(alvos);
    console.log(valorDoAtivo);
    let valorMaximoDeEntrada = document.getElementsByClassName("valor-maximo-entrada")[0];
    valorDoAtivo = valorMaximoDeEntrada.value
    atualizarAlvos(valorDoAtivo);
  });

  //CALCULO DO STOP
  let stop = document.getElementById("stop");
  stop.addEventListener('input',()=>{
    console.log(stop);
    let valorMaximoDeEntrada = document.getElementsByClassName("valor-maximo-entrada")[0];
    valorDoAtivo = valorMaximoDeEntrada.value
    atualizarStop(valorDoAtivo);
    // let stopLoss = event.target||event.srcElement;
    // console.log(stopLoss);
    // if(stopLoss.tagName == "INPUT"){
    //     let prejuizo = 100*(stopLoss.value - valorDoAtivo)/valorDoAtivo;
    //     let prejuizoStopLoss = stopLoss.nextElementSibling;
    //     prejuizoStopLoss.innerText = prejuizo.toFixed(2) + "%";
    //     atualizarCorStop(prejuizo, prejuizoStopLoss);
    // }
  });

  //Carregar entrada
  let loadButton = document.getElementsByClassName("load-button")[0];
  loadButton.addEventListener("click",()=>{
    let myInput = document.getElementById("myInput");
    let precoAtualDoAtivo = 0;
    for (let i = 0; i < responsealvo.length; i++) {
      if(responsealvo[i].symbol == myInput.value){
        precoAtualDoAtivo = responsealvo[i].price;
        break;
      }
    }
    if(precoAtualDoAtivo > 0){
      let valorMinimoDeEntrada = document.getElementsByClassName("valor-minimo-entrada")[0];
      valorMinimoDeEntrada.value = precoAtualDoAtivo*0.995;
      let valorMaximoDeEntrada = document.getElementsByClassName("valor-maximo-entrada")[0];
      valorMaximoDeEntrada.value = precoAtualDoAtivo*1.005;
      console.log(valorMaximoDeEntrada.value);
      atualizarAlvos(valorMaximoDeEntrada.value);
      atualizarStop(valorMaximoDeEntrada.value);
    }else{
      alert("Simbolo não relacionado na binance");
    }
  });

  //Adicionar novo alvo
  let adicionarNovoAlvo = document.getElementById("adicionar-novo-alvo");
  adicionarNovoAlvo.addEventListener("click", ()=>{
    event.preventDefault();
    let tabelaAlvo = document.getElementsByClassName("tabela-alvo");
    let novoLinhaAlvo = document.createElement('div');
    novoLinhaAlvo.setAttribute('class','linha-alvo');
    let novoLabel = document.createElement('label')
    let numeroDoNovoAlvo = document.getElementsByClassName("linha-alvo").length + 1;
    novoLabel.innerText = `Alvo ${numeroDoNovoAlvo} `;
    novoLinhaAlvo.appendChild(novoLabel);
    let novoInput = document.createElement('input');
    novoInput.setAttribute('class','alvo input-text');
    novoInput.setAttribute('type','number');
    novoInput.setAttribute('inputmode', 'decimal');
    novoLinhaAlvo.appendChild(novoInput);
    let novoSpanLucro = document.createElement('span');
    novoSpanLucro.setAttribute('class', 'lucro-alvo');
    novoSpanLucro.innerText = ' %';
    novoLinhaAlvo.appendChild(novoSpanLucro);
    let novoSpanAviso = document.createElement('span');
    novoSpanAviso.setAttribute('class','aviso');
    novoLinhaAlvo.appendChild(novoSpanAviso);
    tabelaAlvo[0].appendChild(novoLinhaAlvo);
       
  });

})

function atualizarAlvos(valorDoAtivo){
  let alvos = document.getElementsByClassName('alvo');
  let lucro;
  let lucroAlvo;
  for(let i = 0; i < alvos.length; i++){
    console.log("alvo" + i + ":"+ alvos[i].value);
    lucro = 100 * ( Number(alvos[i].value) - Number(valorDoAtivo) ) / Number(valorDoAtivo);
    lucroAlvo = alvos[i].nextElementSibling
    lucroAlvo.innerText = lucro.toFixed(2) + "%";
    //atualizarCorAlvos(lucro,lucroAlvo);
    avisoAlvos(lucro,lucroAlvo);
    console.log(lucro);
  }
}

function atualizarStop(valorDoAtivo){
  let stopLoss = document.getElementsByClassName('stop-loss');
  for (let i = 0; i < stopLoss.length; i++){
    let prejuizo = 100*(stopLoss[i].value - valorDoAtivo)/valorDoAtivo;
    let prejuizoStopLoss = stopLoss[i].nextElementSibling;
    prejuizoStopLoss.innerText = prejuizo.toFixed(2) + "%";
    avisoStop(prejuizo,prejuizoStopLoss);
    //atualizarCorStop(prejuizo, prejuizoStopLoss);

  }
}

function atualizarCorAlvos(lucro, lucroAlvo){
  if(lucro >= 0){
    lucroAlvo.style.color = "green";
  }else{
    lucroAlvo.style.color = "red";
  }
}

function atualizarCorStop(prejuizo, prejuizoStopLoss){
  if(prejuizo >= 0){
    prejuizoStopLoss.style.color = "red";
  }else{
    prejuizoStopLoss.style.color = "green";
  }
}

function avisoAlvos(lucro, lucroAlvo){
  if(lucro >= 0){
    lucroAlvo =lucroAlvo.parentNode;
    let aviso = lucroAlvo.getElementsByClassName("aviso")[0];
    aviso.textContent = "";
  }else{
    lucroAlvo =lucroAlvo.parentNode;
    let aviso = lucroAlvo.getElementsByClassName("aviso")[0];
    aviso.textContent = "AVISO! Valor do alvo abaixo do valor de entrada.";
  }
}

function avisoStop(prejuizo, prejuizoStopLoss){
  if(prejuizo >= 0){
    prejuizoStopLoss =prejuizoStopLoss.parentNode;
    let aviso = prejuizoStopLoss.getElementsByClassName("aviso")[0];
    aviso.textContent = "AVISO! Valor do stop acima do valor de entrada.";

  }else{
    prejuizoStopLoss =prejuizoStopLoss.parentNode;
    let aviso = prejuizoStopLoss.getElementsByClassName("aviso")[0];
    aviso.textContent = "";
  }
}

function carregarValoresMaximoEMinimo(){
  let myInput = document.getElementById("myInput");
    let precoAtualDoAtivo = 0;
    for (let i = 0; i < responsealvo.length; i++) {
      if(responsealvo[i].symbol == myInput.value){
        precoAtualDoAtivo = responsealvo[i].price;
        break;
      }
    }
    if(precoAtualDoAtivo > 0){
      let valorMinimoDeEntrada = document.getElementsByClassName("valor-minimo-entrada")[0];
      valorMinimoDeEntrada.value = precoAtualDoAtivo*0.995;
      let valorMaximoDeEntrada = document.getElementsByClassName("valor-maximo-entrada")[0];
      valorMaximoDeEntrada.value = precoAtualDoAtivo*1.005;
      console.log(valorMaximoDeEntrada.value);
      atualizarAlvos(valorMaximoDeEntrada.value);
      atualizarStop(valorMaximoDeEntrada.value);
    }else{
      alert("Simbolo não relacionado na binance");
    }
}

function resetarCampos(){
  let campo = document.getElementsByClassName("campo");
  for (let i= 0; i < campo.length; i++){
    campo[i].value = "";
  }
  atualizarAlvos("1");
  atualizarStop("1");
}
