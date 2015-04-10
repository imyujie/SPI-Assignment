<-! $

date-time-picker = $ '#datetimepicker'
upload-btn = $ '.myhw-upload'
update-btn = $ '.update-deadline'
file-path-block = $ '.file-path'
hw-modal = $ '.modal'

date-time-picker.datetimepicker lang: 'ch'
upload-btn.on 'change', !-> file-path-block.val ($ @).val!
update-btn.on 'click', !->
    console.log 'hehe'
    hw-modal.modal 'show'

identity-btn = $ '.myhw-identity .button'
identity-input = $ '#identity'

identity-btn.on 'click', !->
    this-btn = $ @
    identity-btn.remove-class 'positive'
    this-btn.add-class 'positive'
    valu = if this-btn.attr('id') is 'student' then 0 else 1
    identity-input.val valu


login-form = $ '#login-form'
login-btn = $ '.login-btn'
register-btn = $ '.myhw-register'
username = $ '[name="username"]'
password = $ '[name="password"]'

login-btn.on 'click', !-> if username.val! and password.val! then login-form.submit!

register-btn.on 'click', !-> window.location = '/signup'

signup-submit-btn = $ '#myhw-submit'
signup-submit-btn.on 'click', !-> $ '.myhw-register-form' .submit!

assign-form-submit-btn = $ '.assign-form-submit'
assign-form = $ '.assign-form'

assign-form-submit-btn.on 'click', !-> assign-form.submit!

upload-form = $ '.upload-homework-form'
homework-submit-btn = $ '.homework-submit-btn'

homework-submit-btn.on 'click', !-> upload-form.submit!

datetimeinput = $ '.modal #datetimepicker'
modal-form-submit-btn = $ '.modal-form-submit'
modal-form = $ '.modal-form'
deadline-date = $ '.deadline-date'

modal-form-submit-btn.on 'click', !->
    $.post '/modify', modal-form.serialize!, (data)!->
        if data is '1'
            console.log 'error'
        else
            deadline-date.text data

score-form = $ '.score-form'
score-form.on 'submit', (e) !->
    e.preventDefault!
    this-form = $ @
    score-input = this-form.find '.score-input'
    valu = score-input .val!
    console.log valu
    if not valu then return
    $.post '/score', this-form.serialize!, (data)!->
        score-input.val valu

update-assignment-btn = $ '.update-assignment'
update-assignment-btn.on 'click', !-> window.location = $(@).attr 'data-href'

