/**
 * 
 */

'use strict';

const axios = require("axios");
const colors = require('colors');
const readline = require('readline');
const faker = require('faker');

require('console-png').attachTo(console);

faker.locale = "en";

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

const randomString = (length) => {
	let text = "";
	const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

const register = async (userInfo, cookie, captcha) => {
	const dataReq = Object.assign(userInfo, {captcha});
	return await axios.post('https://trangnguyen.edu.vn/user/register', dataReq, {
			headers: {
				Cookie: cookie,
				Referer: 'https://trangnguyen.edu.vn/dang-ky',
				'Content-Type': 'application/json',
				Origin: 'https://trangnguyen.edu.vn',
				'User-Agent': 'Mozilla/10.0 (Windows NT 10.0) AppleWebKit/538.36 (KHTML, like Gecko) Chrome/69.420 Safari/537.36'
			}
	});
};

const buildList = async (captcha, cookie, n) => {
	const arr = new Array(n);
	arr.fill(1);

	for (let i of arr) {
		const password = faker.internet.password();
		const info = {
			fullname: faker.name.findName(),
			username: randomString(10),
			password: password,
			repassword: password,
			province_id: 1,
			district_id: 27,
			school_id: 26246,
			class_id: 1,
			class_name: 'A1',
			birthday: '01/04/2019',
		}

		const res = await register(info, cookie, captcha);
		const data = res.data;
		if (data.error === 0) {
			console.log(colors.cyan('User:'), colors.green(JSON.stringify(data.user)));
		} else {
			console.log(colors.cyan('Error:'), colors.red(data.message));
		}
	}
};

const init = async () => {
	const res = await getCaptcha();
	console.png(res.data);

	const cookie = getCookie(res);

	rl.question('Enter captcha value:', (captcha) => {
		console.log(colors.cyan('Captcha:'), colors.yellow(captcha));
		buildList(captcha, cookie, 5);
		rl.close();
	});
};

init();