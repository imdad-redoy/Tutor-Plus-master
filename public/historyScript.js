$(document).ready(function(){
	var toid, fromid;

	$('.messageTag').click(function(){
		toid = $(this).attr('data-toid');
		fromid = $(this).attr('data-fromid');
		$('#messageLabel').html('Message:')
		$("#messageText").show();
		$('#submitButton').show();
		$("#submitButton").html('Send Message');
	});

	$('#submitButton').click(function() {
		var text = document.getElementById("messageText").value;
		if (!(text == null || text == "")) {
			$("#submitButton").html('Sending..');
			const data = {};
	        data.text = text;
	        data.toid = toid;
	        data.fromid = fromid;
	        $.ajax({
	            type: 'POST',
	            data: JSON.stringify(data),
	            contentType: 'application/json',
	            url: 'http://localhost:3000/message/submit',         
	            success: function(data, status) {
	                if (status === 'success') {
	                	$('#messageLabel').html('Message sent')
	                    $("#messageText").hide();
	                    $('#submitButton').hide();
	                    window.location.reload();
	                }
	            }
	        });
		}
	});
});