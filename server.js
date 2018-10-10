const express = require('express');
const app = express();

const currentNum = 125;
const response = {
	curNum: currentNum,
	number: 0,
	diff: 0,
	progress: 0
};

calc = (res, number) => {
	res.number = number;
	res.diff = currentNum - number;
	res.progress = number * 100 / currentNum;
};

app.get('/:number', (req, res) => {
	calc(response, req.params.number);
	res.send(response);
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});