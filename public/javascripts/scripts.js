/* eslint-disable no-undef */
$(function() {
    //toggle
    $(".switch-button").on("click", function(e) {
        e.preventDefault();
        $(this).closest("form").toggle();
        $(this).closest("form").siblings("form").toggle();
        $(this).closest("form").find('p.success, p.error').remove();
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
            $($this).closest("form").find('p.error, p.success').remove();
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
            $($this).closest("form").find('p.error, p.success').remove();
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
    $('input, textarea, #post-body').on('focus', function() {
        $(this).closest('form').find('input, #post-body').removeClass('error');
        $(this).closest('form').find('p.error').remove();
    });
});
/* eslint-enable no-undef */

/* eslint-disable no-undef */
$(function() {
    $('.publish-button').on('click', function(e) {
        e.preventDefault();
        const $this = this;

        var data = {
            title: $('#post-title').val(),
            body: $('#post-body').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/post/add'
        }).done(function(data) {
            console.log(data);
            $('.post-form p.error, .post-form p.success').remove();
            //console.log(data);
            if(!data.ok) {
                $('.post-form h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                   data.fields.forEach(function(name) {
                       $($this).closest('form').find('#post-' + name).addClass('error');
                   })
                }
            } else {
                location.href = '/';
            }
        })
    });

    //upload
    $('#fileinfo').on('submit', function(e) {
        e.preventDefault();

        var formDate = new FormData(this);

        $.ajax({
            type: 'POST',
            url: '/upload/image',
            data: formDate,
            processData: false,
            contentType: false,
            // contentType: 'multipart/form-data',
            success: function (result) {
                console.log(result);
            },
            error: function (err) {
                console.error(err);
            }
        })
    });
});
/* eslint-enable no-undef */

/* eslint-disable no-undef */
$(function() {
    var commentForm;
    var parentId;
    
    function form(isNew, comment) {
        $('.replay').show();
        if(commentForm) {
            commentForm.remove();
        }
    
        commentForm = $('form.comment').clone(true, true);
    
        if(isNew) {
            commentForm.find('.cancel').hide();
            commentForm.appendTo('.comment-list');
        } else {
            var parentComment = $(comment).parent();
            parentId = parentComment.attr('id');
            $(comment).after(commentForm)
            // console.log(parentComment)
        }
    
        commentForm.css({'display': 'flex'})
    }
    //load
    form(true);

    //clone form
    $('.replay').on('click', function() {
        form(false, this);
        $(this).hide();
    });

    //cancel form
    $('form.comment .cancel').on('click', function(e) {
        e.preventDefault();
        commentForm.remove();
        form(true);
    });

    $('form.comment .send').on('click', function(e) {
        e.preventDefault();
        const $this = this;

        var data = {
            body: commentForm.find('textarea').val(),
            parent: parentId,
            post: $('.comments').attr('id'),
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/comment/add'
        }).done(function(data) {
            //console.log(data);
            //$('.post-form p.error, .post-form p.success').remove();
            console.log(data);
            if(!data.ok) {
                if(data.error === undefined) {
                    data.error = 'Неизвестная ошибка!';
                }
                $(commentForm).prepend('<p class="error">' + data.error + '</p>')
            } else {
                var newComment =
                        '<ul>'
                    + '     <li style="background-color:#ffffe0">'
                    + '         <div class="head">'
                    + '             <a href="/users/'+  data.login +'">' +  data.login + '</a>'
                    + '            <span class="date">только что</span>'
                    + '         </div>'
                    +  data.body
                    +       '</li>'
                    +  '</ul>'
                $(commentForm).after(newComment);
                form(true);
            }
        })
    });

});
/* eslint-enable no-undef */
