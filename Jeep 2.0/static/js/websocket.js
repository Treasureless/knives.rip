let trackName = document.getElementById("trackName");
let trackArtist = document.getElementById("trackArtist");
let trackLink = document.getElementById("trackLink");

let discordName = document.getElementById("discordName");
let discordStatus = document.getElementById("discordStatus");
let avatarLink = document.getElementById("avatarLink");

let rpcName = document.getElementById("rpcName");
let rpcDetails = document.getElementById("rpcDetails");

let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
let discordID = "153490292081819648";

fetch(`https://api.lanyard.rest/v1/users/909559250911629352`)
    .then((response) => response.json())
    .then((e) => {
        if (e.data["discord_user"]) {
            discordName.innerText = `${e.data.discord_user.username}#${e.data.discord_user.discriminator}`;
            avatarLink.href = `https://discord.com/users/909559250911629352`;
           
            document.getElementById(
                "discordAvatar"
            ).src = `https://cdn.discordapp.com/avatars/909559250911629352/0ac8d3f2a8e8527357d799ba2af6b119.png?size=4096`;
            if (e.data.discord_status == "online") {
                document.getElementById("statusCircle").style.backgroundColor =
                    "#23a55a";
            } else if (e.data.discord_status == "idle") {
                document.getElementById("statusCircle").style.backgroundColor =
                    "#f0b232";
            } else if (e.data.discord_status == "dnd") {
                document.getElementById("statusCircle").style.backgroundColor =
                    "#f23f43";
            } else if (e.data.discord_status == "offline") {
                document.getElementById("statusCircle").style.backgroundColor =
                    "#80848e";
            }
        }

        if (e.data["listening_to_spotify"]) {
            trackName.innerText = `${e.data.spotify.song}`;
            let artists = e.data.spotify.artist;
            let artistFinal = artists.replaceAll(";", ",");
            trackArtist.innerText = artistFinal;
            document.getElementById("trackImg").src = e.data.spotify.album_art_url;
            trackLink.href = `https://open.spotify.com/track/${e.data.spotify.track_id}`;
        } else {
            trackName.innerText = "None";
            trackArtist.innerText = "I'm not currently listening anything";
            document.getElementById("trackImg").src = "./template/musicDefault.png";
        }

        if (e.data["activities"].length > 0) {
            if (e.data["activities"][0].name == "Spotify") {
                rpcName.innerText = e.data["activities"][1].name;
                rpcDetails.innerText =
                    e.data["activities"][1].details +
                    "\n" +
                    e.data["activities"][1].state;
                //rpcState.innerText = e.data["activities"][1].state
                document.getElementById(
                    "rpcIcon"
                ).src = `https://cdn.discordapp.com/app-assets/909559250911629352/${e.data["activities"][1].assets.large_image}.png`;
                document.getElementById(
                    "rpcSmallIcon"
                ).src = `https://cdn.discordapp.com/app-assets/909559250911629352/${e.data["activities"][1].assets.small_image}.png`;
            } else {
                rpcName.innerText = e.data["activities"][0].name;
                rpcDetails.innerText =
                    e.data["activities"][0].details +
                    "\n" +
                    e.data["activities"][0].state;
                //rpcState.innerText = e.data["activities"][0].state
               
                
            }
        
        }
    });

webSocket.addEventListener("message", (event) => {
    data = JSON.parse(event.data);

    if (event.data == '{"op":1,"d":{"heartbeat_interval":30000}}') {
        webSocket.send(
            JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_id: discordID,
                },
            })
        );
        setInterval(() => {
            webSocket.send(
                JSON.stringify({
                    op: 3,
                    d: {
                        heartbeat_interval: 30000,
                    },
                })
            );
        }, 30000);
    }
    if (data.t == "PRESENCE_UPDATE") {
        if (data.d.spotify) {
            trackName.innerText = data.d.spotify.song;
            let artists = data.d.spotify.artist;
            let artistFinal = artists.replaceAll(";", ",");
            trackArtist.innerText = artistFinal;
            document.getElementById("trackImg").src = data.d.spotify.album_art_url;
            trackLink.href = `https://open.spotify.com/track/${data.d.spotify.track_id}`;
      
        }
    }
});