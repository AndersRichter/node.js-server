const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const serverToken = '7feb24af-fc38-44de-bc38-04defc3804de';
const url = 'http://localhost:5000/api/queue';

let status = {};

const makeRequest = (method, number, url) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, false);
    xhr.setRequestHeader("Content-Type", "application/json");

    if (number) {
        xhr.send(JSON.stringify({
            server_token: serverToken,
            number: number
        }));
    } else { xhr.send(); }

    if (xhr.status > 202) {
        console.log( xhr.status + ': ' + xhr.statusText );
        return false;
    } else {
        console.log(JSON.parse(xhr.responseText));
        return JSON.parse(xhr.responseText);
    }
};

let number = 1;
makeRequest('POST', 1, url + '/clear');

const randomNumber = () => {
    return Math.floor(Math.random() * (15000 - 5000)) + 5000;
};

const sendNumberToQueue = () => {
    makeRequest('POST', number, url);
    number++;
};

const moveNumberToOperate = () => {
    makeRequest('PUT', status.queue[status.queue.length - 1], url);
};

const moveNumberFromOperate = () => {
    makeRequest('DELETE', status.operate[status.operate.length - 1], url);
};

const checkQueue = () => {
    if (status.queue.length < 10) {
        sendNumberToQueue();
    }
    if (status.queue.length > 15) {
        moveNumberToOperate();
    }
    if (status.operate.length < 2) {
        moveNumberToOperate();
    }
    if (status.operate.length > 5) {
        moveNumberFromOperate();
    }
};

const getQueue = () => {
    const queue = makeRequest('GET', null, url);
    if (queue) { status = queue; }
};

setInterval(function () {
    getQueue();
    checkQueue();
}, 3000);

let sNTQ = setTimeout(function tick() {
    getQueue();
    sendNumberToQueue();
    sNTQ = setTimeout(tick, randomNumber());
}, randomNumber());

let mNTO = setTimeout(function tick() {
    getQueue();
    moveNumberToOperate();
    mNTO = setTimeout(tick, randomNumber());
}, randomNumber());

let mNFO = setTimeout(function tick() {
    getQueue();
    moveNumberFromOperate();
    mNFO = setTimeout(tick, randomNumber());
}, randomNumber());
