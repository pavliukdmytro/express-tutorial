$(function() {
  $(".switch-button").on("click", function(t) {
    t.preventDefault(),
      $(this)
        .closest("form")
        .toggle(),
      $(this)
        .closest("form")
        .siblings("form")
        .toggle();
  });
});
