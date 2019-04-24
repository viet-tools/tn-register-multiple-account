/**
 * code by: viet-tools
 */

'use strict';

const axios = require("axios");
const moment = require("moment");
const colors = require('colors');
const readline = require('readline');
const faker = require('faker');

require('console-png').attachTo(console);

faker.locale = "en";

const provinces = require('./data/provinces.json').reduce((arr, item) => {arr.push(item._id); return arr;}, []);
const districts = require('./data/districts.json').reduce((arr, item) => {arr.push(item._id); return arr;}, []);
const schools = require('./data/schools.json').reduce((arr, item) => {arr.push(item._id); return arr;}, []);
const classids = [1, 2, 3, 4, 5];
const class_name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const class_nameSt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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
	const possible = "abcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

const randomArray = (items) => {
	return items[Math.floor(Math.random()*items.length)];
};

const randomDate = (start, end) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
			province_id: randomArray(provinces),
			district_id: randomArray(districts),
			school_id: randomArray(schools),
			class_id: randomArray(classids),
			class_name: `${randomArray(class_name)}${randomArray(class_nameSt)}`,
			birthday: moment(randomDate(new Date(2006, 0, 1), new Date(2012, 0, 1))).format('DD/MM/YYYY')
		}

		const res = await register(info, cookie, captcha);
		const data = res.data;
		if (data.error === 0) {
			data.user.password_hash = data.user.password;
			data.user.password = password;
			console.log(colors.cyan('User:'), colors.green(JSON.stringify(data.user)));
		} else {
			console.log(colors.cyan('Error:'), colors.red(data.message));
			if (['Mã xác nhận không đúng', 'Đã hết phiên làm việc - hãy load lại mã xác nhận'].includes(data.message)) {
				init();
			}
		}
	}
};

const numberUser = process.env.NUMBER_USER ? parseInt(process.env.NUMBER_USER): 100;

const init = async () => {
	const res = await getCaptcha();
	console.png(res.data);

	const cookie = getCookie(res);

	rl.question('Enter captcha value:\n', (captcha) => {
		console.log(colors.cyan('Captcha:'), colors.yellow(captcha));
		buildList(captcha, cookie, numberUser);
		rl.close();
	});
};

init();
