// Elements
const startBtn = document.querySelector("#startGriffithBtn");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const turnon = document.querySelector("#turnOn");
const msgs = document.querySelector(".messages");

let griffithCommands = [];
griffithCommands.push("hi griffith");
griffithCommands.push("what are your command");
griffithCommands.push("close this - to close opened popups");
griffithCommands.push(
  "change my information - information regarding your acoounts and you"
);
griffithCommands.push("whats the weather or temperature");
griffithCommands.push("show the full weather report");
griffithCommands.push("are you there - to check fridays presence");
griffithCommands.push("shut down - stop voice recognition");
griffithCommands.push("open google");
griffithCommands.push('search for "your keywords" - to search on google ');
griffithCommands.push("open whatsapp");
griffithCommands.push("open youtube");
griffithCommands.push('play "your keywords" - to search on youtube ');
griffithCommands.push("close this youtube tab - to close opened youtube tab");
griffithCommands.push("open firebase");
griffithCommands.push("open netlify");
griffithCommands.push("open twitter");
griffithCommands.push("open my twitter profile");
griffithCommands.push("open instagram");
griffithCommands.push("open my instagram profile");
griffithCommands.push("open github");
griffithCommands.push("open my github profile");

//Weather setup
function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      // weatherCont[2].textContent = `Timezone : ${data.timezone}`;
      // weatherCont[3].textContent = `Longitude : ${data.coord.lon}`;
      // weatherCont[4].textContent = `Latitude : ${data.coord.lat}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}°C`;
      weatherCont[6].textContent = `Feels like : ${ktc(
        data.main.feels_like
      )}°C`;
      weatherCont[7].textContent = `Min temperature : ${ktc(
        data.main.temp_min
      )}°C`;
      weatherCont[8].textContent = `Max temperature : ${ktc(
        data.main.temp_max
      )}°C`;
      // weatherCont[11].textContent = `Pressure : ${data.main.pressure} hPa`;
      // weatherCont[12].textContent = `Humidity : ${data.main.humidity}%`;
      // weatherCont[13].textContent = `Visibility : ${data.visibility} m`;
      // weatherCont[14].textContent = `Wind speed : ${data.wind.speed} m/s`;
      // weatherCont[15].textContent = `Wind direction : ${data.wind.deg}°`;
      // document.querySelector(".searchBox").classList.add("onSearch");
      // document.querySelector(".content").classList.add("onContent");

      weatherStatement = `sir the weather in ${data.name} is ${
        data.weather[0].description
      } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather info not found";
      alert("Some error occurred while fetching the weather data.");
    }
  };

  xhr.send();
}

// Function to convert Kelvin to Celsius
function ktc(kelvin) {
  return (kelvin - 273.15).toFixed(2); // Converting Kelvin to Celsius and rounding to 2 decimal places
}

//Time setup

let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let sec = date.getSeconds();

function autoGriffith() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

// Onload(window)

window.onload = () => {
  //   turnon.play();
  document.addEventListener("click", () => {
    turnon.play(); // Play the audio after a user clicks anywhere on the page
  });
  turnon.addEventListener("ended", () => {
    setTimeout(() => {
      autoGriffith();
      readOut("Ready to go");
      if (localStorage.getItem("griffithSetup") === null) {
        readOut("Please fill your details to get started");
      }
    }, 200);
  });

  griffithCommands.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p> #${e} </p> <br/>`;
  });

  time.textContent = `${hrs} : ${mins} : ${sec}`;
  //   setInterval(() => {
  //     let date = new Date();
  //     let hrs = date.getHours();
  //     let mins = date.getMinutes();
  //     let sec = date.getSeconds();
  //     time.textContent = `${hrs} : ${mins} : ${sec}`;
  //   }, 1000);

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    currentTime = strTime;
    time.textContent = strTime;
  }

  formatAMPM(date);
  setInterval(() => {
    formatAMPM(date);
  }, 60000);

  // Battery Setup

  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallBack);

  function batteryCallBack(batteryObject) {
    printBatteryStatus(batteryObject);

    setInterval(() => {
      printBatteryStatus(batteryObject);

      navigator.onLine
        ? (internet.textContent = "Online")
        : (internet.textContent = "Offline");
    }, 2000);
  }

  function printBatteryStatus(batteryObject) {
    battery.textContent = `${batteryObject.level * 100} %`;

    if (batteryObject.charging == true) {
      document.querySelector("#battery").style.width = "300px";
      document.querySelector("#battery").style.left = "-45px";
      battery.textContent = `${(batteryObject.level * 100).toFixed(0)} % 
      (Charger Plucked in)`;
    } else {
      document.querySelector("#battery").style.left = "36px";
      battery.textContent = `${(batteryObject.level * 100).toFixed(0)} %`;
    }
  }

  //Internet Setup

  navigator.onLine
    ? (internet.textContent = "Online")
    : (internet.textContent = "Offline");
};

function createMsg(who, msg) {
  let newMsg = document.createElement("p");
  newMsg.innerText = msg;
  newMsg.setAttribute("class", who);
  msgs.appendChild(newMsg);
}

// Griffith Setup

if (localStorage.getItem("griffithSetup") != null) {
  weather(JSON.parse(localStorage.getItem("griffithSetup")).location);
}

const setup = document.querySelector(".griffithSetup");
setup.style.display = "none";
if (localStorage.getItem("griffithSetup") === null) {
  //   setup.style.display = "flex";
  setup.style.display = "block";

  setup.querySelector("button").addEventListener("click", userInfo);
}

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value,
    instagram: setup.querySelectorAll("input")[3].value,
    github: setup.querySelectorAll("input")[4].value,
    linkedin: setup.querySelectorAll("input")[5].value,
  };

  let testArr = [];

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("Sir, please enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("griffithSetup", JSON.stringify(setupInfo));
    setup.style.display = "none";
    weather(JSON.parse(localStorage.getItem("griffithSetup")).location);
  }
}

// SR Setup
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;

// SR Start
recognition.onstart = function () {
  console.log("Voice recognition started.");
};

// SR Result

let windowsB = [];

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  let userData = localStorage.getItem("griffithSetup");
  transcript = transcript.toLowerCase();
  //   console.log(`my words: ${transcript}`);
  createMsg("userMessage", transcript);

  // Check if the transcript contains any of the desired phrases

  if (transcript.includes("what's the current charge")) {
    readOut(`the current charge is ${charge}`);
  }
  if (transcript.includes("what's the charging status")) {
    readOut(`the current charging status is ${chargeStatus}`);
  }
  if (transcript.includes("current time")) {
    readOut(currentTime);
  }
  if (transcript.includes("connection status")) {
    readOut(`you are ${connectivity} sir`);
  }
  if (
    transcript.includes("hi griffith") ||
    transcript.includes("hello griffith")
  ) {
    readOut("Hello sir, how may I help you");
  }

  if (transcript.includes("what are your commands")) {
    readOut("sir here's the list of commands i can follow");
    if (window.innerWidth <= 400) {
      window.resizeTo(screen.width, screen.height);
    }
    document.querySelector(".commands").style.display = "block";
  }
  if (transcript.includes("Tell about yourself")) {
    readOut(
      "sir, i am a griffith, a voice asistant made for browsers using javascript by Ayush Sir. I can do anything which can be done from a browser."
    );
  }
  if (transcript.includes("close this")) {
    readOut("closing the tab sir");
    document.querySelector(".commands").style.display = "none";
    if (window.innerWidth >= 401) {
      window.resizeTo(250, 250);
    }
    setup.style.display = "none";
  }

  if (transcript.includes("change my information")) {
    readOut("Opening the information tab sir");
    localStorage.clear();

    if (window.innerWidth <= 400) {
      window.resizeTo(screen.width, screen.height);
    }
    setup.style.display = "flex";
    setup.querySelector("button").addEventListener("click", userInfo);
  }
  if (transcript.includes("what's the temperature")) {
    readOut(weatherStatement);
  }
  if (transcript.includes("full weather report")) {
    readOut("opening the weather report sir");
    let a = window.open(
      `https://www.google.com/search?q=weather+in+${
        JSON.parse(localStorage.getItem("jarvis_setup")).location
      }`
    );
    windowsB.push(a);
  }

  if (transcript.includes("open")) {
    // readOut(`opening ${input} sir`);
    let input = transcript.replace("open", "").trim().split(" ").join("+");
    readOut(`opening ${input} sir`);
    window.open(`https://www.${input}.com`);
  }
  if (transcript.includes("open my github profile")) {
    readOut("opening your github profile sir");
    window.open(`https://github.com/${JSON.parse(userData).github}`);
  }
  if (transcript.includes("open my linkedin profile")) {
    readOut("opening your linkedin profile sir");
    window.open(`https://www.linkedin.com/in/${JSON.parse(userData).linkedin}`);
  }
  if (transcript.includes("shut down")) {
    readOut("ok sir i will take a nap");
    recognition.stop();
  }

  if (transcript.includes("search for")) {
    readOut("here's what I found");
    let input = transcript
      .replace("search for", "")
      .trim()
      .split(" ")
      .join("+");
    window.open(`https://www.google.co.in/search?q=${input}`);
  }
  if (transcript.includes("play")) {
    readOut("as you wish sir");
    let input = transcript.replace("play", "").trim().split(" ").join("+");
    window.open(`https://www.youtube.com/results?search_query=${input}`);
  }
};

// SR Stop
recognition.onend = function () {
  console.log("Voice recognition ended due to silence.");
};

// Button Event Listeners
startBtn.addEventListener("click", () => {
  recognition.start();
});

// stopBtn.addEventListener("click", () => {
//   recognition.stop();
// });

// speakBtn.addEventListener("click", () => {
//   readOut("Hello, I’m Griffith");
// });

// Griffith Speech

let voices = [];

const loadVoices = () => {
  voices = speechSynthesis.getVoices();
};

const readOut = (message) => {
  const speech = new SpeechSynthesisUtterance();

  // Set the selected voice if available
  const selectedVoice = voices.find((voice) => voice.name === "Rishi");
  if (selectedVoice) {
    speech.voice = selectedVoice;
  }

  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);

  createMsg("griffithMessage", message);
};

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();
