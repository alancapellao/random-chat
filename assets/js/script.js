var conn = new WebSocket('ws://localhost:8080');

var $form1 = $('#form1');
var $inp_message = $('#message');
var $inp_name = $('#username');
var $area_content = $('#chat');
var t = new Date();

conn.onopen = function (e) {
    console.log("Conectado");
};

conn.onmessage = function (e) {
    var data = JSON.parse(e.data);

    if (data.type === 'newConnection') {
        newJoin(data.id);
    } else if (data.type === 'disconnection') {
        newLeft(data.id);
    } else {
        showMessages('other', e.data);
    }
};

$inp_message.on('keypress', function (e) {

    if (e.key === "Enter") {
        if ($inp_message.val() != '') {
            var msg = { 'name': $inp_name.val(), 'msg': $inp_message.val() };
            msg = JSON.stringify(msg);

            conn.send(msg);
            showMessages('self', msg);
            $inp_message.val("");
        }
    }
});

function showMessages(how, data) {

    data = JSON.parse(data);

    var $li = $('<li>').addClass(how);

    var $div_msg = $('<div>').addClass('msg');

    if (how != "self") {
        var $div_user = $('<div>').addClass('user').text(data.name);
        $div_msg.append($div_user);
    }

    var $p = $('<p>').text(data.msg);

    var $time = $('<time>').text(t.getHours() + ':' + (t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()));

    $div_msg.append($p);
    $div_msg.append($time);

    $li.append($div_msg);

    $area_content.append($li);
}

function newJoin(data) {
    data = JSON.parse(data);
    var p = $('<p>').addClass('notification').text('Connection id: ' + data + ' joined the group');
    $('#chat').append(p);
}

function newLeft(data) {
    var p = $('<p>').addClass('notification').text('Connection id: ' + data + ' left the group');
    $('#chat').append(p);
}




