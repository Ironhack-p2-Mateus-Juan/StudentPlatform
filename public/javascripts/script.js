$(document).ready(() => {
  let nav = document.getElementById("main-nav");
  let btnList = nav.getElementsByClassName("nav-link");

  for (let i = 0; i < btnList.length; i++) {
    btnList[i].addEventListener("click", function() {
      let currentActiveBtn = document.getElementsByClassName("active");
      if (this.id !== "profileDropdown") {
        currentActiveBtn[0].className = currentActiveBtn[0].className.replace(
          " active",
          ""
        );
        this.className += " active";
      }
    });
  }

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
});
