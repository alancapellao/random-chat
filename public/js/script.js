const conn = new WebSocket('ws://localhost:8080');

const $inpMessage = $('#message');
const $inpName = $('#username');
const $btnConfirm = $('#btnConfirm');
const $areaContent = $('#chat');
const t = new Date();
let receivedId;

conn.onopen = function (e) {
    console.log("Servidor conectado!");
};

conn.onmessage = function (e) {
    const data = JSON.parse(e.data);

    if (data.type === 'newConnection' && data.username != '' && data.username != undefined) {
        newJoin(data);
    } else if (data.type === 'disconnection' && data.username != '' && data.username != undefined) {
        newLeft(data);
    } else if (data.type === 'ownId') {
        receivedId = data.id;
    } else if (data.msg != '' && data.msg != undefined) {
        showMessages('other', data);
    }
};

$inpMessage.on('keypress', function (e) {
    if (e.key === "Enter") {
        if ($inpMessage.val() !== '') {
            const msg = {
                username: $inpName.val(),
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

            url: '../../src/controller/insert.php',
            type: "POST",
            data: {
                id: receivedId,
                username: $inpName.val()
            },
            success: function (retorno) {
                retorno = JSON.parse(retorno);

                if (!retorno["erro"]) {
                    $(".setuser").fadeOut(100);
                    $(".typezone .message").prop('disabled', false);

                    const msg = {
                        type: 'newConnection',
                        id: receivedId,
                        username: $inpName.val()
                    };
                    conn.send(JSON.stringify(msg));
                }
            }
        });
    } else {
        alert("Please enter a username.");
        $(".setuser input.username").focus();
    }
});

function showMessages(how, data) {

    const $li = $('<li>').addClass(how);
    const $divMsg = $('<div>').addClass('msg');

    if (how !== 'self') {
        const $divUser = $('<div>').addClass('user').text(data.username);
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
    const p = $('<p>').addClass('notification').text(data.username + ' joined the group');
    $('#chat').append(p);
}

function newLeft(data) {
    const p = $('<p>').addClass('notification').text(data.username + ' left the group');
    $('#chat').append(p);
}

window.addEventListener("beforeunload", function (e) {
    const msg = {
        type: 'disconnection',
        id: receivedId,
        username: $inpName.val()
    };
    conn.send(JSON.stringify(msg));
});