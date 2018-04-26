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

  $("#btn-edit-comment").click(() => {
    $("#form-edit-comment").fadeIn(500);
  });

  $("#btn-cancel-edit-comment").click(() => {
    $("#form-edit-comment").fadeOut(500);
  });
});
