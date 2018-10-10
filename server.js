const express = require('express');
const app = express();

let currentNum = 10;

const response = {
	curNum: 0,
	number: 0,
	diff: 0,
	progress: 0
};
const curResponse = {
	curNum: 0
};

let curNumChange = setInterval(() => {
		currentNum++;
	}, 5000);

calc = (res, number) => {
	res.curNum = currentNum;
	res.number = number;
	res.diff = number - currentNum;
	res.progress = Math.floor(currentNum * 100 / number);
	if (res.diff <= 0) {
		res.diff = 0;
		res.progress = 100;
	}
};

app.get('/queue/info', (req, res) => {
	curResponse.curNum = currentNum;
	res.send(curResponse);
});

app.get('/queue/:number', (req, res) => {
	calc(response, req.params.number);
	res.send(response);
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});