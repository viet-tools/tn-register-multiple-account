/**
 * code by: viet-tools
 */

'use strict';

const axios = require("axios");
const moment = require("moment");
const colors = require('colors');
const faker = require('faker');

faker.locale = "en";

const provinces = require('./locations/provinces.json').reduce((arr, item) => {arr.push(item._id); return arr;}, []);
const districts = require('./locations/districts.json').reduce((arr, item) => {arr.push(item._id); return arr;}, []);
const schools = require('./locations/schools.json').reduce((arr, item) => {arr.push(item._id); return arr;}, []);
const classids = [1, 2, 3, 4, 5];
const class_name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const class_nameSt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const randomString = (length) => {
	let text = "";
	const possible = "abcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

const randomLocation = (items) => {
	return items[Math.floor(Math.random()*items.length)];
};

const randomDate = (start, end) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const register = async (userInfo) => {
	const dataReq = Object.assign(userInfo, {captcha: '639791'});
	return await axios.post('https://trangnguyen.edu.vn/user/register', dataReq, {
			headers: {
				Cookie: 'tndata=WpCdQt-AWBfCHheGgBOXdg.wKnxCgxVlZHB64F_zaKt69EXBpSLEJYEFYNdkrAEe54.1556074184753.3600000.DiPlpB_UbiPL1Uw5aXhrON41IgF1G8l6V1sNa9WvYqk',
				Referer: 'https://trangnguyen.edu.vn/dang-ky',
				'Content-Type': 'application/json',
				Origin: 'https://trangnguyen.edu.vn',
				'User-Agent': 'Mozilla/10.0 (Windows NT 10.0) AppleWebKit/538.36 (KHTML, like Gecko) Chrome/69.420 Safari/537.36'
			}
	});
};

const buildList = async () => {
	const password = faker.internet.password();
	const info = {
		fullname: faker.name.findName(),
		username: randomString(10),
		password: password,
		repassword: password,
		province_id: randomLocation(provinces),
		district_id: randomLocation(districts),
		school_id: randomLocation(schools),
		class_id: randomLocation(classids),
		class_name: `${randomLocation(class_name)}${randomLocation(class_nameSt)}`,
		birthday: moment(randomDate(new Date(2006, 0, 1), new Date(2012, 0, 1))).format('DD/MM/YYYY')
	}

	const res = await register(info);
	const data = res.data;
	if (data.error === 0) {
		data.user.password_hash = data.user.password;
		data.user.password = password;
		console.log(colors.cyan('User:'), colors.green(JSON.stringify(data.user)));
	} else {
		console.log(colors.cyan('Error:'), colors.red(data.message));
		if (data.message === 'Mã xác nhận không đúng') {
			process.exit(1);
		}
	}

	setTimeout(() => {
		buildList();
	}, 20);
};

buildList();