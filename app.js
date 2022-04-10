const puppeteer = require('puppeteer');

const xl = require('excel4node');

const wb = new xl.Workbook();

const ws = wb.addWorksheet('preços')

const nodeSchedule = require('node-schedule');
 

//inserir modelos aqui 

const modelos = ['Iphone 13 pro Max','Iphone 13','Iphone 12','Iphone 11'] 

/*  Essa parte se refere a configuração do arquivo em excel  */ 

// váriaveis onde armazena informações para colunas no excel
const final = []
const finalProd = []
const final2 = []
const finalProd2 = []

//cabeçalho do arquivo -- adicionar mais caso queira
const headingColumnNames = [
  "Aparelhos Novos",
  "Preços ",
  "Preço Usado",
  "Aparelhos Usados",
];

let headingColumnIndex = 1;


headingColumnNames.forEach(heading => {    // escreve na primeira linha como cabeçalho
  ws.cell(1, headingColumnIndex++).string(heading);
})


let rowNew = 2;  // começar da segunda coluna 
let rowProd =2
let rowNew2 = 2;  // começar da segunda coluna 
let rowProd2 =2 ;
let horaRow =2;

/* ----------  */

const botNew = async () => {

    for (x=0 ; x < modelos.length ; x++) {


        const newItens = 'https://www.google.com.br/search?hl=pt-BR&tbm=shop&sxsrf=APq-WBurN2wTzeqr1Ixd7MZexp9TlMZcFg:1649279846399&psb=1&q='+modelos[x]+'&tbs=mr:1,new:1&sa=X&ved=0ahUKEwjNj4SbroD3AhUnGbkGHfJsCQQQsysIyAwoAA&biw=1920&bih=931'

        const browser = await puppeteer.launch({
            headless: true,  //mostrar browser = false esconder browser = true
            defaultViewport: null  // pega o máximo de resolução
          });


        const page = await browser.newPage();
        await page.goto(newItens);
        await page.waitForTimeout(3000);
        await page.waitForSelector('.a8Pemb');
        await page.screenshot({ path: `${modelos[x]}.png`, fullPage: true })
        const prices = await page.$$eval('.a8Pemb', inputs => { return inputs.map(input => input.textContent) })
        
        for(i=0; i <= prices.length; i++) {
          final.push(`${prices[i]}`)  // para cada valor add
          finalProd.push(`${modelos[x]}`)    // para cada valor add
          }
 }
};

const botOld = async () => {

  for (x=0 ; x < modelos.length ; x++) {


    const newItens = 'https://www.google.com/search?tbm=shop&sxsrf=APq-WBusz1xMPj1n2-moTYa1wKL-dWmVuw:1649367562165&q='+modelos[x]+'&tbs=mr:1,new:3&sa=X&ved=0ahUKEwjQxY399IL3AhWrhJUCHZa8DqcQsysIzwsoAQ&biw=1920&bih=931&dpr=1'

    const browser = await puppeteer.launch({
        headless: true,  //mostrar browser = false esconder browser = true
        defaultViewport: null  // pega o máximo de resolução
      });


    const page = await browser.newPage();
    await page.goto(newItens);
    await page.waitForTimeout(3000);
    await page.waitForSelector('.a8Pemb');
    await page.screenshot({ path: `${modelos[x]}-usados.png`, fullPage: true })
    const prices = await page.$$eval('.a8Pemb', inputs => { return inputs.map(input => input.textContent) })

    for(i=0; i <= prices.length; i++) {
      final2.push(`${prices[i]}`)    // para cada valor add
      finalProd2.push(`${modelos[x]}`)    // para cada valor add
      }
    }
};




function writeFile(){
    
    final.forEach(record => {
 
      Object.keys(record).forEach(columnName => {
          ws.cell(rowNew, 2).string(record);
      });
  
      rowNew++;
  })

   finalProd.forEach(record => {
 
    Object.keys(record).forEach(columnName => {
        ws.cell(rowProd, 1).string(record);
    });
    rowProd++;
})

  finalProd2.forEach(record => {
 
    Object.keys(record).forEach(columnName => {
        ws.cell(rowProd2, 4).string(record);
    });

    rowProd2++;
  })


  final2.forEach(record => {
  
    Object.keys(record).forEach(columnName => {
        ws.cell(rowNew2, 3).string(record);
    });
    rowNew2++;
})

wb.write('produtos.xlsx')

} 

async function job(){
  await botNew();
  await botOld();
  await writeFile();
  console.log('fim');
}

job()



/* Habilitar apenas se quiser add para rodar diariamente em servidor junto e recomendável com PM2

const job = async nodeSchedule.scheduleJob('* * * * * *', () => {
  await botNew();
  await botOld();
  await writeFile();
  console.log('fim');
});

*/
/* explicação para agendamento  colocar / e numero /5
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

*/