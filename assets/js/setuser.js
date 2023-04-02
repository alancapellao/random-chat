$(document).ready(function () {

    $(".setuser button").click(function () {
        var desiredName = $(".setuser .username").val();
        if (desiredName !== "") {
            username = desiredName;
            $(".setuser").fadeOut(100);
            $(".typezone .message").prop('disabled', false);
        } else {
            alert("Please enter a username.");
            $(".setuser input.username").focus();
        }
    });
});