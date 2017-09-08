$('form').validate({
  rules: {
    repassword: {
      equalTo: '#password'
    }
  },
  messages: {
    repassword: {
      equalTo: 'Must match with password typed above'
    }
  },
  errorClass: 'alert alert-danger'
});