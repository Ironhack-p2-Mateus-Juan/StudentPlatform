$(document).ready(() => {
  /* User menu animation */
  $(".dropdown").on("show.bs.dropdown", function(e) {
    $(this)
      .find(".dropdown-menu")
      .first()
      .stop(true, true)
      .slideDown(300);
  });
  $(".dropdown").on("hide.bs.dropdown", function(e) {
    $(this)
      .find(".dropdown-menu")
      .first()
      .stop(true, true)
      .slideUp(200);
  });

  setTimeout(() => {
    $("#post-tips-container").fadeIn(500);
  }, 2000);
  setTimeout(() => {
    $("#post-tips-container").fadeOut(500);
  }, 7000);
});
