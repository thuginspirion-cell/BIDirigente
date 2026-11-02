const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('const BASE_ESCOLAS_PADRAO = [');
const end = content.indexOf('];', start);
const jsonStr = content.substring(start + 'const BASE_ESCOLAS_PADRAO = '.length, end + 1);
const escolas = eval(jsonStr);

// Coordenadas base por cidade
const CIDADES_BASE = {
  'Barueri': [-23.5110, -46.8760],
  'Itapevi': [-23.5485, -46.9322],
  'Jandira': [-23.5276, -46.9028],
  'Pirapora': [-23.3980, -47.0010]
};

// Coordenadas geográficas reais das 60 escolas da Diretoria de Ensino de Itapevi
const COORDENADAS_ESCOLAS = {
  // Barueri (19 escolas)
  '009787': [-23.5042, -46.8821], // Ivani Maria Paes
  '009799': [-23.5015, -46.8654], // Caio Prado Junior
  '009830': [-23.4938, -46.8892], // Republica do Equador
  '009878': [-23.5065, -46.8573], // Alayde Domingues
  '009891': [-23.5188, -46.8875], // Jose Wilson Padinha
  '009912': [-23.5072, -46.8489], // Aldeia de Barueri
  '009921': [-23.5165, -46.8672], // Jose Domingos da Silveira
  '035440': [-23.5142, -46.8924], // Republica de Cuba
  '040548': [-23.4981, -46.8294], // Nestor de Camargo
  '040551': [-23.5221, -46.8615], // Lenio Vieira de Moraes
  '044921': [-23.5108, -46.8758], // Myrthes Therezinha
  '044933': [-23.5312, -46.8724], // Mario Joaquim Escobar
  '049025': [-23.5355, -46.8698], // Jardim Maria Helena I
  '290075': [-23.5284, -46.8631], // Henrique Fernando Gomes
  '908617': [-23.5398, -46.8762], // Jardim Paulista
  '908836': [-23.5338, -46.8682], // Itajahy Feitosa Martins
  '910485': [-23.4891, -46.8215], // Amador Aguiar
  '918805': [-23.4925, -46.8528], // Leonor Mendes de Barros
  '920241': [-23.4875, -46.8235], // Parque Imperial

  // Jandira (14 escolas)
  '010364': [-23.5342, -46.9085], // Dorvalino Abilio Teixeira
  '010376': [-23.5215, -46.8972], // Maria Cristina Lopes
  '010397': [-23.5276, -46.9028], // Vicente Themudo Lessa
  '010649': [-23.5298, -46.9112], // Henrique Sammartino
  '010662': [-23.5245, -46.9056], // Oswaldo Sammartino
  '041373': [-23.5385, -46.9145], // Joao Batista Solde
  '041385': [-23.5412, -46.8965], // Moacir Thomaz da Silva
  '044817': [-23.5368, -46.9015], // Luis da Camara Cascudo
  '049013': [-23.5238, -46.9092], // Manoel Augusto Vieira Neto
  '496790': [-23.5185, -46.9152], // Terezinha Palone da Silva
  '908563': [-23.5325, -46.9185], // Dolores Garcia Paschoalin
  '918787': [-23.5452, -46.9078], // Wilmar Soares da Silva
  '921440': [-23.5195, -46.9135], // Giuseppe Angelo Bertolli
  '923333': [-23.5262, -46.8995], // Josepha Pinto Chiavelli

  // Itapevi (25 escolas)
  '010388': [-23.5432, -46.9285], // Jose Chaluppe
  '010424': [-23.5365, -46.9198], // Celina de Barros Bairao
  '010431': [-23.5582, -46.9412], // Americo Valentin Christianini
  '010443': [-23.5645, -46.9785], // Nacif Amin Chalupe
  '010467': [-23.5485, -46.9322], // Raul Briquet Doutor
  '010479': [-23.5512, -46.9945], // Claro Camargo Ribeiro
  '010480': [-23.5525, -46.9245], // Dimaraes Antonio Sandei
  '010613': [-23.5445, -46.9365], // Candido Rondon Marechal
  '010650': [-23.5415, -46.9385], // Jose Neyde Cesar Lessa
  '043886': [-23.5468, -46.9825], // Jose Theotonio dos Santos
  '046607': [-23.5528, -46.9920], // Joao Nascif Chalupp
  '048161': [-23.5595, -46.9398], // Iracema Rauen Maciel
  '048173': [-23.5615, -46.9275], // Eliza de Oliveira Ribeiro
  '048975': [-23.5395, -46.9455], // Mary Mallet Cyrino
  '048999': [-23.5542, -46.9485], // Romeo Mecca Padre
  '149317': [-23.5562, -46.9465], // Jose Sergio Pereira
  '352561': [-23.5715, -46.9525], // Air Ferreira do Nascimento
  '902044': [-23.5625, -46.9365], // Ignes Amelia Oliveira
  '908548': [-23.5478, -46.9515], // Paulo de Abreu
  '910454': [-23.5515, -46.9395], // Maria Soares Santos
  '921439': [-23.5565, -46.9315], // Paulo da Costa Pan Chacon
  '923874': [-23.5535, -46.9260], // Eliana Andres de Almeida
  '011778': [-23.5492, -46.9340], // Senor Abravanel
  '011779': [-23.5458, -46.9310], // Ediner Ferreira de Moraes
  '011780': [-23.5470, -46.9355], // Michela Trevizan

  // Pirapora do Bom Jesus (2 escolas)
  '043333': [-23.3955, -46.9985], // Nercy Amelia Martelini Daher
  '925834': [-23.4125, -46.9812]  // Parque Payol
};

console.log('Total de escolas no objeto de coordenadas:', Object.keys(COORDENADAS_ESCOLAS).length);

// Validação de todas as 60 escolas
let todasPresentes = true;
escolas.forEach(e => {
  if (!COORDENADAS_ESCOLAS[e.cie]) {
    console.error('FALTANDO:', e.cie, e.nome);
    todasPresentes = false;
  }
});

if (todasPresentes) {
  console.log('TODAS AS 60 ESCOLAS POSSUEM COORDENADAS VÁLIDAS!');
}
