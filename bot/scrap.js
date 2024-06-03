// const pup = require('puppeteer');
const cheerio = require('cheerio');
const request = require('requests');


const dailyScrap = async (page = 1) => {
    let allJobs = [];
    const resultProgramathor = async () => {
        const dataProgramathor = () => new Promise((resolve, reject) => {
            request(`https://programathor.com.br/jobs-city/remoto?page=${page}`).on('data', (chunk) => {
                resolve(chunk)
            }).on('end', function (err) {
                if (err) return reject(err);

                console.log('End load data cheerio');
            });
        })

        const data = await dataProgramathor();
        const documentData = cheerio.load(data)
        const jobs = []
        const cells = []
        const cell = documentData('.cell-list-content');
        cell.each((index, element) => {
            cells.push(documentData(element).html())
        })
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
                title: `Vaga: ${documentData('h3').eq(index).html()}`,
                url: `https://programathor.com.br` + documentData('.cell-list > a').eq(index).attr('href')
            })
        })

        return jobs
    }


    for (let i = 1; i < page; i++) {
        const result = await resultProgramathor(i)
        allJobs = allJobs.concat(result)
    }
    
    return allJobs
}

module.exports = dailyScrap;