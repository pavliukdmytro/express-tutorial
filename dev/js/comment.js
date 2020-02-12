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
