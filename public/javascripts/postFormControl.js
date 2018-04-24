(function() {
  "use strict";
  window.addEventListener(
    "load",
    function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      let forms = document.getElementsByClassName("needs-validation");

      // Loop over them and prevent submission
      let validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener(
          "submit",
          function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });

      /* Show file name of selected image */
      $(".custom-file-input").on("change", function() {
        let fileName = $(this)
          .val()
          .split("\\")
          .pop();
        $(this)
          .next(".custom-file-label")
          .addClass("selected")
          .html(fileName);
      });
    },
    false
  );
})();

$(document).ready(() => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const today = year + "-" + month + "-" + day;

  $("#post-type").change(() => {
    let currentType = $("#post-type").val();

    if (currentType === "Event") {
      $("#new-post").attr("action", "/event/new");

      $("#form-event-address").fadeIn();
      $("#form-event-date").fadeIn();
      $("#form-event-time").fadeIn();

      $("#input-event-date").attr("min", today);
    } else if (currentType === "Post" || currentType === "") {
      $("#new-post").attr("action", "/post/new");

      $("#form-event-address").fadeOut();
      $("#form-event-date").fadeOut();
      $("#form-event-time").fadeOut();
    }
  });
});
