const puppeteer = require('puppeteer');

(async () => {
	const username = ''; // coloque seu usuário entre as aspas
	const password = ''; // coloque sua senha entre as aspas

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(`https://pt.clubcooee.com/users/friends/${username}`);

	await page.waitForSelector('.navbar--item');
	await page.click('.navbar--item a');
	await page.waitForSelector('#id_username');
	await page.waitForSelector('#id_password');
	await page.type('#id_username', username);
	await page.type('#id_password', password);

	await page.click('.checkbox--label');
	await page.click('#id_submit');

	await page.waitForNavigation();
	await page.goto(`https://pt.clubcooee.com/users/myfriends`);
	const friends = await page.evaluate(() => {
		const friendNames = document.querySelectorAll('.friend-list--name a');
		const friendsArray = [];
		friendNames.forEach((friend) => {
			friendsArray.push(friend.innerText);
		});

		return friendsArray;
	});
    let counter = 0;
	for (let i = 0; i < friends.length; i++) {
		await page.goto(`https://pt.clubcooee.com/users/rosterchange/${friends[i]}/ignore`, {
			waitUntil: 'domcontentloaded'
		});
		console.log('Deletando agora: ' + friends[i]);
        counter++;
	}

    await page.goto("https://pt.clubcooee.com/logout");
    console.log("Foram deletados: " + counter + " amigos da sua lista!");
	await browser.close();
})();
