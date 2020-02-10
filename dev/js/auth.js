/* eslint-disable no-undef */
$(function() {
    //toggle
    $(".switch-button").on("click", function(e) {
        e.preventDefault();
        $(this).closest("form").toggle();
        $(this).closest("form").siblings("form").toggle();
        $(this).closest("form").find('p.success, p.error').remove('');
        $(this).closest("form").find('.error').removeClass('error');
        $(this).closest("form").find('input').val('');
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
            location.href = '/';
        })
    });
    $('.login-button').on('click', function(e) {
        e.preventDefault();
        var $this = this;
    
        var data = {
            login: $('#login-login').val(),
            password: $('#login-password').val(),
        };
    
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/login'
        }).done(function(data) {
            $('p.error, p.success').remove();
            if(!data.ok) {
                $('.login h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                    data.fields.forEach(function(name) {
                        $($this).closest('form').find('input[name="login-' + name + '"]').addClass('error');
                    })
                }
                return;
            }
            location.href = '/';
        })
    });
    $('input, textarea').on('focus', function() {
        $('input').removeClass('error');
        $('p.error').remove();
    });
});
/* eslint-enable no-undef */
