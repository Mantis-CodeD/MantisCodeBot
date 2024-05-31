const pup = require('puppeteer');

const dailyScrap = async () => {
    const browser = await pup.launch({ headless: 'auto', defaultViewport: null })
    const pages = await browser.pages();
    const page = await pages[0];
    await page.goto('https://programathor.com.br/jobs-city/remoto')
    const resultsProgramathor = await page.evaluate(() => {
        const jobs = []
        const cells = document.querySelectorAll('.cell-list-content');
        cells.forEach((element, index) => {
            jobs.push({
                color: 5763719,
                author: {
                    name: 'ProgramaThor',
                    icon_url: 'https://programathor.com.br/assets/thor-91ae45b43c0df483b3ada7728d09a3458d40119e8cdb47abadd9f15a0f62172c.png',
                    url: 'https://programathor.com.br'
                },
                footer: {
                    text: 'Todas as vagas são retiradas do site ProgramaThor, todas as vagas presentes aqui são para trabalho remoto e devem ser consultadas diretamente no site responsável'
                },
                title: `Vaga: ${element.querySelector('h3').textContent}`,
                url: document.querySelectorAll('.cell-list > a')[index].href
            })
        })
        return jobs
    })

    await page.goto("https://www.geekhunter.com.br/vagas");
    await page.waitForSelector('#__next > div.css-1x4b1hx > div > div > div > div > div:nth-child(3) > div.chakra-stack.css-nd8846 > label:nth-child(1) > span.chakra-checkbox__control.css-1g040xt')
    await page.click('#__next > div.css-1x4b1hx > div > div > div > div > div:nth-child(3) > div.chakra-stack.css-nd8846 > label:nth-child(1) > span.chakra-checkbox__control.css-1g040xt');
    await page.click('#__next > div.css-1x4b1hx > div > div > div > div > button');
    await page.waitForSelector('.css-z1iy3r')

    const resultsGeekHunter = await page.evaluate(() => {
        const jobs = []
        const cells = document.querySelectorAll('.css-z1iy3r');
        cells.forEach((element, index) => {
            jobs.push({
                color: 5763719,
                author: {
                    name: 'GeekHunter',
                    icon_url: 'https://i.imgur.com/p4WbwgG.png',
                    url: 'https://www.geekhunter.com.br/'
                },
                footer: {
                    text: 'Todas as vagas são retiradas do site GeekHunter, todas as vagas presentes aqui são para trabalho remoto e devem ser consultadas diretamente no site responsável'
                },
                title: `Vaga: ${element.querySelector('div > h3').textContent}`,
                url: document.querySelectorAll('.css-1g6fhjg > a')[index].href
            })
        })
        return jobs
    })

    return resultsProgramathor.concat(resultsGeekHunter)
}

module.exports = dailyScrap;