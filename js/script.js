//Checking if the Javascript is connected
console.log("Hieeeeeeeeeeee!");

var menu_links = document.querySelectorAll("nav a");
var showstars = {};
var remove = {};
var create = {};

//Create 3 empty arrays to fill up with the DB data
var universes = [];
var stars = [];
var colors = [];

//Fetching the data from the DB and putting them in the empty arrays
fetch('http://localhost:1234/universes')
   .then(response => response.json())
   .then(data => universes = data);


fetch('http://localhost:1234/stars')
   .then(response => response.json())
   .then(data => stars = data);

fetch('http://localhost:1234/colors')
   .then(response => response.json())
   .then(data => colors = data);


//Function to reset the URL to the original path without refreshing the page
function removeHash() {
   history.pushState("", document.title, window.location.pathname + window.location.search);
}

//Resetting the page to the initial values clicking to the Logo, emptying the divs etc...
document.querySelector("h1#logo a").addEventListener("click", function (event) {
   event.preventDefault();
   removeHash();
   document.querySelector("#universes").innerHTML = "";
   document.querySelector("#stars").innerHTML = "";
   document.querySelector("#maintitle").innerHTML = `Hello Worrrrrrrrrrrrld!`
}, false);


//Rendering the the Universes Tab
function renderUniverses() {
   document.querySelector("#universes").innerHTML = `<div id="list"></div>`;
   document.querySelector("#maintitle").innerHTML = "Universes";
   //Listing the universes
   universes.forEach(universe => {
      document.querySelector("#universes #list").innerHTML += `<div id="universe_${universe.id}">
      <h3> ${universe.name} </h3> 
      <p>which has a maximum of <em>${universe.maxSize}</em> and a current size of <em>${universe.id} </em>  </p>
      <a onclick="event.preventDefault()" href="" id="${universe.id}" class="show_stars">Details =></a>
      </div>`;
      
   })
   //Adding a Button to create my own Universe
   document.querySelector("#universes").innerHTML += `<button id="create-view" class="btn">Create View</button>`;
         
         createUniverse();
         applyCss();
         showStars();
}

//Rendering the Star Tab
function renderStars() {
   console.log("All the stars that I see are ", stars)
   document.querySelector("#maintitle").innerHTML = "Stars";
   document.querySelector("#stars").innerHTML = `<div id="list"></div>`;

   //Listing the stars
   stars.forEach(star => {
      var tempUni = "";
      universes.forEach(universe => {
         if (universe.id == star.universeId){
            tempUni = universe.name;
         }
      });
      document.querySelector("#stars #list").innerHTML += `
            <div>
               <h3> ${star.name} </h3> <p>which is part of the Universe <em>${tempUni}</em></p>
            </div>`;

   })
   applyCss();

}

//Create new Universes
function createUniverse() {
   //CRUD Universe
   document.querySelector("#create-view").addEventListener("click", function (event) {
      document.querySelector("#universes").innerHTML += `<div id="form"><input type="text" id="uni_name" name="universe"/>
               <button id="add_uni" class="btn">Create a new Universe</button></div>`;
      //Adding the universes to the array and to the list
      document.querySelector("#add_uni").addEventListener("click", function (event) {
         console.log("I am creating a new universe called " + document.querySelector("#uni_name").value);
         universes[universes.length] = {
            id: (universes.length * 12),
            maxSize: (universes.length * 3),
            name: document.querySelector("#uni_name").value
         }
        renderUniverses();
         
      }, false)
   }, false)
}

//Show the stars in the Universes Tab for each Universe
function showStars() {
   //Crud Showing the Stars      
   showstars = document.querySelectorAll(".show_stars");
   console.log(showstars);
   showstars.forEach(s => {
      s.addEventListener("click", function (event) {
         console.log(event.target.id);
         document.querySelector(`#universe_${event.target.id}`).innerHTML += `<ul class="uni_stars"> </ul>`;
         displayStars(event.target.id);
        
         
      }, false)
   });
}

function displayStars(uni_id){

   var tempStars = stars.filter(star => star.universeId == uni_id)
         console.log(tempStars)
         document.querySelector(`#universe_${uni_id} .uni_stars`).innerHTML = ``;
         tempStars.forEach(star => {
            document.querySelector(`#universe_${uni_id} .uni_stars`).innerHTML += 
            `<li> ${star.name} <button  class="delete" id="star_${star.id}">X</button></li>`;
         })
         //Adding the create star link
         document.querySelector(`#universe_${uni_id} .uni_stars`).innerHTML += 
         `<li><em><a onclick="event.preventDefault()" href="" id="create_${uni_id}" class="create_star">Create Star</a>
         </em></li>`;
         create = document.querySelectorAll(".create_star");         
         remove = document.querySelectorAll(".delete");
         removeStar();
}

///Creating a star
function createStar(){
   console.log("In Create STAR biiiiiiiiiiitch");
   create.forEach(c => {
      c.addEventListener("click", function (event) {
         console.log("create the starrrrrrrrrrr")
         console.log(c.id);
         document.querySelector(`#${c.id}`).parentNode.parentNode.innerHTML = 
         `<div>
            <input type="text" class="star_name" />
            <button class="btn" id="add_star" name="${c.id}">Create Star</button>
          </div>`
         ;
         document.querySelector("#add_star").addEventListener("click", function (event) {
            console.log("I am creating a new star called " + document.querySelector(".star_name").value);
            stars[stars.length] = {
               color : colors[Math.floor(Math.random() * colors.length)],
               id: (stars.length * 12),
               name: document.querySelector(".star_name").value,
               universeId: c.id.slice(7)
            } 
            console.log(stars);
            displayStars(c.id.slice(7));
         }, false) 
       }, false) 
   });
}

//Eliminating a star
function removeStar() {
   remove.forEach(r => {
      r.addEventListener("click", function (event) {
         console.log("In the EL remove ")
         var tempR = r.id.slice(5);
         console.log("About to remove the star ", tempR);
         var uniId = stars.find(star => star.id == tempR).universeId
         stars = stars.filter(star => star.id != tempR);
         
         
         displayStars(uniId);
      }, false) 
   });
   createStar();
}

function applyCss(){
   document.querySelectorAll("#list div").forEach(elem=>{
      elem.style.background = colors[Math.floor(Math.random() * colors.length)];
   });
   console.log("applying the css to ", document.querySelectorAll("#list div"))
}

//Getting the links of the menu, and setting the interactions
menu_links.forEach(e => {
   e.addEventListener("click", function (event) {
      menu_links.forEach(evt => {
         evt.style.border = "none";
         document.querySelector("#universes").innerHTML = "";
         document.querySelector("#stars").innerHTML = "";
      })
      if (e.hash === "#universes") {
         //Highlighting the selected Menu
         e.style.border = "1px solid white";

         renderUniverses();
         //showStars();

      } else if (e.hash === "#stars") {
         //Highlighting the selected Menu
         e.style.border = "1px solid white";

         renderStars();
         
      } else if (e.hash === "#imprint") {

         document.querySelector("#maintitle").innerHTML = "Imprint";

         //Highlighting the selected Menu
         e.style.border = "1px solid white"

      } else {
         document.querySelector("#maintitle").innerHTML = "She done already had herses";

      }

   }, false);




});