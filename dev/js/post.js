/* eslint-disable no-undef */
$(function() {
    $('.publish-button, .save-button').on('click', function(e) {
        e.preventDefault();
        const $this = this;

        let isDraft = $(this).hasClass('save-button');

        var data = {
            title: $('#post-title').val(),
            body: $('#post-body').val(),
            isDraft,
            postId: $('#post-id').val()
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
                if(isDraft) {
                    location.href = '/post/edit/' + data.post.id;
                } else {
                    location.href = '/posts/' + data.post.url;
                }
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
