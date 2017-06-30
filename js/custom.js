// Closes the sidebar menu
$("#menu-close").click(function(e) {
  e.preventDefault();
  $("#sidebar-wrapper").toggleClass("active");
});

// Opens the sidebar menu
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#sidebar-wrapper").toggleClass("active");
});

// Scrolls to the selected menu item on the page
$(function() {
  $("a[href*=#]:not([href=#])").click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $("html,body").animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

// Map scrolling behaviour
$(document).ready(function() {
  $("#map_iframe").addClass("scrolloff");
  $("#map").on("click", function () {
    $("#map_iframe").removeClass("scrolloff");
  });

  $("#map_iframe").mouseleave(function  () {
    $("#map_iframe").addClass("scrolloff");
  });
});

// Add Clippy and Friends
var clippys = [];
var clippySayings = ["PARTY", "Time to party yo", "shag down", "virtual flash mob yo", "holla", "clippy man"];
function makeClippy(type) {
  clippy.load(type, function(agent){
    clippys.push(agent);
    var randX = Math.floor(Math.random() * $(document).width());
    var randY = Math.floor(Math.random() * $(document).height());
    var randSaying = Math.floor(Math.random() * clippySayings.length);
    agent.moveTo(randX,randY);
    agent.show();
    agent.speak(clippySayings[randSaying]);
  });
}

// On start load Clippys
$(document).ready(function() {
  setTimeout(function() { makeClippy('Clippy'); }, 1000);
  setTimeout(function() { makeClippy('Merlin'); }, 3000);
  setTimeout(function() { makeClippy('Rover'); }, 6000);
  setTimeout(function() { makeClippy('Links'); }, 9000);
});
