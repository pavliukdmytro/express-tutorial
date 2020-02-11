/* eslint-disable no-undef */
$(function() {
    
    var commentForm;
    //clone form
    $('#new, #replay').on('click', function() {
        if(commentForm) {
            commentForm.remove();
        }
        
        commentForm = $('form.comment').clone(true, true);
        console.log(commentForm);
        if($(this).attr('id') === 'new') {
            commentForm.appendTo('.comment-list');
        }
        
        commentForm.css({'display': 'flex'})
    });
    
    //cancel form
    $('form.comment .cancel').on('click', function(e) {
        e.preventDefault();
        commentForm.remove();
    });
    
    $('form.comment .send').on('click', function(e) {
        e.preventDefault();
        const $this = this;
        
        var data = {
            body: commentForm.find('textarea').val(),
            parent: null,
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
            //console.log(data);
            //if(!data.ok) {
            //    $('.post-form h2').after('<p class="error">' + data.error + '</p>');
            //    if(data.fields) {
            //        data.fields.forEach(function(name) {
            //            $($this).closest('form').find('#post-' + name).addClass('error');
            //        })
            //    }
            //    return;
            //}
            //location.href = '/';
        })
    });
    
});
/* eslint-enable no-undef */