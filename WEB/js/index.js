let flask_sign = document.getElementsByClassName("server-status-icon-loading")[0];
let flask_text = document.getElementsByClassName("text-loading")[0];
let postgre_sign = document.getElementsByClassName("server-status-icon-loading")[1];
let postgre_text = document.getElementsByClassName("text-loading")[1];

function checkServer() {
    fetch('http://127.0.0.1:5000', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .catch(() => {
        flask_sign.setAttribute('class', 'server-status-icon-bad');
        flask_text.setAttribute('class', 'server-status-text text-bad');
        flask_text.innerText = 'BAD';
        postgre_sign.setAttribute('class', 'server-status-icon-bad');
        postgre_text.setAttribute('class', 'server-status-text text-bad');
        postgre_text.innerText = 'BAD';
    })
    .then(response => response.json())
    .then(data => {
        flask_sign.setAttribute('class', 'server-status-icon-good');
        flask_text.setAttribute('class', 'server-status-text text-good');
        flask_text.innerText = 'GOOD';
        postgre_sign.setAttribute('class', 'server-status-icon-good');
        postgre_text.setAttribute('class', 'server-status-text text-good');
        postgre_text.innerText = 'GOOD';
    })
}

setTimeout("checkServer()", 500);