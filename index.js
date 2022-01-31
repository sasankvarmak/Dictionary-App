let defineEl = document.getElementById("define");
let resetEl = document.getElementById("reset");
let saveEl = document.getElementById("save");
let searchedWordEl = document.getElementById("word");
let inputEl = document.getElementById("input");
let addDefineEl = document.getElementById("add-define");
let addExampleEl = document.getElementById("add-example");
let alertBoxEl = document.getElementById("alert-container");
let buttonErrorEl = document.getElementById("error-button");
let alertBoxFoundEl = document.getElementById("alert-found-container");
let buttonFoundAlertEl = document.getElementById("found-button");
let bgContainerEl = document.getElementById("bg-container");
let tableBodyEl = document.getElementById("table-body");
let details = [];

let c = localStorage.getItem("details");

details = JSON.parse(c);
if (details != null) {
  tableData(details);
} else {
  details = [];
}

let finalData = [];

let url = "";
let options = {
  method: "GET",
};

let word = "";

function getTime() {
  let currentdate = new Date();
  let datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  console.log(datetime);
  return datetime;
}

function searchUrl() {
  word = inputEl.value;
  if (word == "") {
    alertBoxEl.classList.toggle("d-none");
    bgContainerEl.classList.toggle("d-none");
  } else {
    url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

    searchedWordEl.textContent = word;

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (responsedata) {
        definitions = [...responsedata[0].meanings[0].definitions];

        createAndAppend(definitions);
      })
      .catch((error) => {
        console.log("ERRor catched");
        alertBoxEl.classList.toggle("d-none");
        bgContainerEl.classList.toggle("d-none");
      });
  }
}

function createAndAppend(definitions) {
  let k = [];
  let l = [];
  for (let obj of definitions) {
    k.push(obj.definition);
    l.push(obj.example);
  }

  definition(k);
  example(l);
}

function definition(definations) {
  let y = "Definition";
  addDefineEl.appendChild(wordName(y));
  addDefineEl.classList.add("list-container");

  for (let x of definations) {
    let liEl = document.createElement("li");
    if (x != undefined) {
      let pEl = document.createElement("p");
      pEl.textContent = x;
      liEl.appendChild(pEl);
    }

    addDefineEl.appendChild(liEl);
  }
}
function example(examples) {
  let y = "Example";
  addExampleEl.appendChild(wordName(y));
  addExampleEl.classList.add("list-container");

  for (let x of examples) {
    let liEl = document.createElement("li");
    if (x != undefined) {
      let pEl = document.createElement("p");
      pEl.textContent = x;
      liEl.appendChild(pEl);
    }

    addExampleEl.appendChild(liEl);
  }
}
function wordName(text) {
  let nameEl = document.createElement("p");
  nameEl.textContent = text;
  nameEl.classList.add("wordName");
  return nameEl;
}

function clearAll() {
  inputEl.value = "";
  word = "";
  addDefineEl.innerHTML = "";
  addExampleEl.innerHTML = "";
  searchedWordEl.textContent = "Search Word";
}

function saveWords(beforedata) {
  let wordData;
  let time = getTime();
  let n = details.length;

  let index;

  if (details.length == 0) {
    wordData = {
      word: word,
      addedOn: time,
      lastSearchedOn: time,
      noOfTimes: 1,
    };
  } else {
    for (let obj of beforedata) {
      if (obj.word == word) {
        alertBoxFoundEl.classList.toggle("d-none");
        bgContainerEl.classList.toggle("d-none");
        wordData = {
          word: word,
          addedOn: time,
          lastSearchedOn: obj.addedOn,
          noOfTimes: obj.noOfTimes + 1,
        };

        index = details.findIndex((obj) => obj.word == word);

        details.splice(index, 1);

        break;
      } else {
        wordData = {
          word: word,
          addedOn: time,
          lastSearchedOn: time,
          noOfTimes: 1,
        };
      }
    }
  }

  return wordData;
}

function dataSave() {
  if (word == "") {
    alertBoxEl.classList.toggle("d-none");
    bgContainerEl.classList.toggle("d-none");
  } else {
    let beforeData = [];
    let n = details.length;
    if (n > 0) {
      let i = 0;
      while (i <= n - 1) {
        beforeData.push(details[i]);
        i += 1;
      }
    }

    let dataEl = saveWords(beforeData);

    details.push(dataEl);

    tableData(details);
    localStorage.setItem("details", JSON.stringify(details));

    clearAll();
  }
}

function tableData(details) {
  let n = details.length;
  let i = 1;
  tableBodyEl.innerHTML = "";
  while (i <= 10 && i <= n) {
    let lastobj = details[n - i];
    let trEl = document.createElement("tr");
    trEl.innerHTML = `<td>${lastobj.word}</td>
    <td>${lastobj.addedOn}</td>
    <td>${lastobj.lastSearchedOn}</td>
    <td>${lastobj.noOfTimes}</td>
  `;
    tableBodyEl.appendChild(trEl);
    i += 1;
  }
}

function buttonToggle() {
  alertBoxEl.classList.toggle("d-none");
  bgContainerEl.classList.toggle("d-none");
  clearAll();
}

function toggleFound() {
  alertBoxFoundEl.classList.toggle("d-none");
  bgContainerEl.classList.toggle("d-none");
  clearAll();
}

buttonErrorEl.addEventListener("click", buttonToggle);
buttonFoundAlertEl.addEventListener("click", toggleFound);
defineEl.addEventListener("click", searchUrl);
resetEl.addEventListener("click", clearAll);
saveEl.addEventListener("click", dataSave);
