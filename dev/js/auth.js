/* eslint-disable no-undef */
$(function() {
    //toggle
    $(".switch-button").on("click", function(e) {
        e.preventDefault();
        $(this)
        .closest("form")
        .toggle();
        $(this)
        .closest("form")
        .siblings("form")
        .toggle();
    });
    
    $('.register-button').on('click', function(e) {
        e.preventDefault();
        var $this = this;
        
        var data = {
            login: $('#register-login').val(),
            password: $('#register-password').val(),
            passwordConfirm: $('#register-password-confirm').val()
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/register'
        }).done(function(data) {
            $('p.error, p.success').remove();
            //console.log(data);
            if(!data.ok) {
                $('.register h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                    data.fields.forEach(function(name) {
                        $($this).closest('form').find('input[name="' + name + '"]').addClass('error');
                    })
                }
                return;
            }
            $('.register h2').after('<p class="success">Отлично</p>');
        })
    });
    $('input, textarea').on('focus', function() {
        $(this).removeClass('error');
        $('p.error').remove();
    })
});
/* eslint-enable no-undef */
