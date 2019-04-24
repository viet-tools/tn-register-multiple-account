/**
 * code by: viet-tools
 */

 'use strict';

const fs = require("fs");
const axios = require("axios");
const colors = require('colors');
const readline = require('readline');
require('console-png').attachTo(console);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const getCaptcha = async () => {
	return await axios.get("https://trangnguyen.edu.vn/captcha.png", {
		responseType: 'arraybuffer'
	});
};

const getCookie = (res) => {
	const cookies = res.headers['set-cookie'];
	const filter = cookies.filter(cookie => {
		return cookie.indexOf('tndata=') === 0;
	});

	if(filter.length > 0) {
		return filter[0].split(';')[0];
	}
	return '';
};

const saveToken = (captcha, cookie) => {
	fs.writeFileSync("./data/session.json", JSON.stringify({captcha, cookie}));
};

const init = async () => {
	const res = await getCaptcha();
	console.png(res.data);

	const cookie = getCookie(res);

	rl.question('Enter captcha value:\n', (captcha) => {
		console.log(colors.cyan('Captcha:'), colors.yellow(captcha));
		saveToken(captcha, cookie);
		rl.close();
	});
};

init();
