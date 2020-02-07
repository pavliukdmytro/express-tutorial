/* eslint-disable no-undef */
$(function () {
    //toggle
   $('.switch-button').on('click', function(e) {
       e.preventDefault();
       $(this).closest('form').toggle();
       $(this).closest('form').siblings('form').toggle();
    })
});
/* eslint-enable no-undef */
