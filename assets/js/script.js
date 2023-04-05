const conn = new WebSocket('ws://localhost:8080');

const $inpMessage = $('#message');
const $inpName = $('#username');
const $btnConfirm = $('#btnConfirm');
const $areaContent = $('#chat');
const t = new Date();
let receivedId;

conn.onopen = function (e) {
    //console.log("Conectado");
};

conn.onmessage = function (e) {
    const data = JSON.parse(e.data);

    if (data.type === 'newConnection') {
        newJoin(data.id);
    } else if (data.type === 'disconnection') {
        newLeft(data.id);
    } else if (data.type === 'ownId') {
        receivedId = data.id;
    } else {
        showMessages('other', data);
    }
};

$inpMessage.on('keypress', function (e) {
    if (e.key === "Enter") {
        if ($inpMessage.val() !== '') {
            const msg = {
                name: $inpName.val(),
                msg: $inpMessage.val()
            };
            conn.send(JSON.stringify(msg));
            showMessages('self', msg);
            $inpMessage.val('');
        }
    }
});

$btnConfirm.on('click', function (e) {
    e.preventDefault();

    if ($inpName.val() !== "") {

        $.ajax({

            url: 'controller/insert.php',
            type: "POST",
            data: {
                id: receivedId,
                username: $inpName.val()
            },
            success: function (retorno) {
                retorno = JSON.parse(retorno);

                if (retorno["erro"]) {
                    alert(retorno["mensagem"]);
                } else {
                    $(".setuser").fadeOut(100);
                    $(".typezone .message").prop('disabled', false);
                }
            }
        });
    } else {
        alert("Please enter a username.");
        $(".setuser input.username").focus();
    }
});

window.addEventListener('unload', function () {
    $.ajax({
        url: 'controller/close.php',
        type: 'POST',
        async: false,
        data: {
            id: receivedId
        }
    });
});

function showMessages(how, data) {

    const $li = $('<li>').addClass(how);
    const $divMsg = $('<div>').addClass('msg');

    if (how !== 'self') {
        const $divUser = $('<div>').addClass('user').text(data.name);
        $divMsg.append($divUser);
    }

    const $p = $('<p>').text(data.msg);
    const $time = $('<time>').text(t.getHours() + ':' + (t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()));
    $divMsg.append($p);
    $divMsg.append($time);
    $li.append($divMsg);
    $areaContent.append($li);
}

function newJoin(data) {
    const p = $('<p>').addClass('notification').text('User ' + data + ' joined the group');
    $('#chat').append(p);
}

function newLeft(data) {
    const p = $('<p>').addClass('notification').text('User ' + data + ' left the group');
    $('#chat').append(p);
}



