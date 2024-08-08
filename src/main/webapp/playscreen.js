function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};


function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
};
//setting audio volume
let bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.1;

let musicButton = document.getElementById("musicButton");
let musicImage = document.getElementById("musicImage");

let musicClickNum = 1;
musicButton.addEventListener("click", () => {

	if (musicClickNum % 2 == 0) {
		musicImage.src = "assets/notMute.png"
		setCookie("volume","on",365);
		bgMusic.volume = 0.1
	} else {
		musicImage.src = "assets/mute.png"
		setCookie("volume","off",365);
		bgMusic.volume = 0.0
	}
	musicClickNum++;
});


document.getElementById("RoomId").innerHTML  = getCookie("roomId")
if(getCookie("volume") == "off") musicButton.click();


/*
let prefix = `${window.location.hostname}`;
prefix = 'wss:' + prefix + "/CooperativeMinesweeperWeb/Game/";*/
let chatSocketString = `wss:${window.location.hostname}:8080/CooperativeMinesweeperWeb/Chat/${getCookie("roomId")}/${getCookie("username")}`;
console.log(chatSocketString);
let chatSocket = new WebSocket(chatSocketString);



chatSocket.onopen = function (event) {
    console.log("Connected to WebSocket server.");
};

chatSocket.onmessage = function (event) {

	let li = document.createElement("li");
	li.textContent = event.data;
	document.getElementById("messages").appendChild(li)
	document.getElementById("textChat").value = "";
};

chatSocket.onclose = function (event) {
    console.log("Disconnected from WebSocket server.");
};



document.getElementById("textChat").addEventListener("keydown",(event)=>{
	if (event.key == "Enter"){
		chatSocket.send(document.getElementById("textChat").value);
	}
})


