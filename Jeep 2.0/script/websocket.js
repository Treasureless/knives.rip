let trackName = document.getElementById("trackName");
let trackArtist = document.getElementById("trackArtist");
let trackLink = document.getElementById("trackLink");

let discordName = document.getElementById("discordName");
let discordMotd = document.getElementById("discordMotd");
let avatarLink = document.getElementById("avatarLink");

let rpcName = document.getElementById("rpcName");
let rpcDetails = document.getElementById("rpcDetails");

let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
let discordID = "153490292081819648";

fetch(`https://api.lanyard.rest/v1/users/909559250911629352`)
    .then((response) => response.json())
    .then((e) => {
        if (e.data["discord_user"]) {
            
           
            document.getElementById
            
            
        }

        if (e.data["listening_to_spotify"]) {
            trackName.innerText = `${e.data.spotify.song}`;
            let artists = e.data.spotify.artist;
            let artistFinal = artists.replaceAll(";", ",");
            trackArtist.innerText = artistFinal;
            document.getElementById("trackImg").src = e.data.spotify.album_art_url;
            trackLink.href = `https://open.spotify.com/track/${e.data.spotify.track_id}`;
        } else {
            trackName.innerText = "";
            trackArtist.innerText = "currently not listening to anything";
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