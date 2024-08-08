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



document.getElementById("username").value = getCookie("username");
document.getElementById("GameId1").value = getCookie("roomId");

document.getElementById("Join").addEventListener("click", async function () {
  // When the button is clicked, send an HTTP request to the server
  setCookie("username", document.getElementById("username").value, 1);
  setCookie("roomId", document.getElementById("GameId1").value, 1);



  await fetch(window.location  + "/Check", {
    method: "POST",
    body: JSON.stringify({
      roomId: document.getElementById("GameId1").value
    })

  }).then(async response =>{
    const data = await response.json()
    console.log(data.exists)
    if(data.exists == "false") return;
    else window.location.assign('playscreen.html');
  });
 

});

document.addEventListener('mousemove', function (e) {
  var cursorArea = document.getElementById('cursorFollower');
  cursorArea.style.left = (e.pageX) + 'px';
  cursorArea.style.top = (e.pageY) + 'px';
  cursorArea.style.backgroundPositionX = -(e.pageX) + 'px'
  cursorArea.style.backgroundPositionY = -(e.pageY) + 'px';
});


document.getElementById("CreateGame").addEventListener("click",async function(){
  await fetch(window.location + "/Create",{method:'Post'}).then(async response => {
    let data =await response.json();
    console.log(data.Id);
    setCookie("roomId", data.Id, 1);
    setCookie("username", document.getElementById("username").value, 1);
    window.location.assign('playscreen.html');
  });
});


document.getElementById("GameId2").addEventListener("click",async ()=>{
  await fetch(window.location + "/getGame").then(
    async response => {
      let text = await response.json();
      console.log(text.data);
    }
  )
})