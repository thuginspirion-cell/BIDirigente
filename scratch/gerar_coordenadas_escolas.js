const fs = require('fs');

// Centros e offsets de bairros conhecidos na região metropolitana oeste
const BAIRRO_COORDS = {
  // BARUERI (centro -23.511, -46.876)
  'Vila Boa Vista': [-23.5042, -46.8821],
  'Jd Califórnia': [-23.5015, -46.8654],
  'Engenho Novo': [-23.4938, -46.8892],
  'Jd Tupã': [-23.5065, -46.8573],
  'Jd Belval': [-23.5188, -46.8875],
  'Aldeia de Barueri': [-23.5072, -46.8489],
  'Jd São Vicente': [-23.5165, -46.8672],
  'Jd Itaquiti': [-23.5142, -46.8924],
  'Jd Mutinga': [-23.4981, -46.8294],
  'Jd Santa Mônica': [-23.5221, -46.8615],
  'Centro Barueri': [-23.5108, -46.8758],
  'Parque Viana': [-23.5312, -46.8724],
  'Pq dos Camargos': [-23.5355, -46.8698],
  'Jd. Maria Helena': [-23.5284, -46.8631],
  'Jd Paulista': [-23.5398, -46.8762],
  'Pq Imperial': [-23.4891, -46.8215],
  '18 do Forte': [-23.4925, -46.8528],

  // JANDIRA (centro -23.528, -46.903)
  'Jd Belmonte': [-23.5342, -46.9085],
  'Jd Alvorada': [-23.5215, -46.8972],
  'Centro Jandira': [-23.5276, -46.9028],
  'Vila Rosa Emilia': [-23.5298, -46.9112],
  'Vl Anita Costa': [-23.5245, -46.9056],
  'Jd São Nicolau': [-23.5385, -46.9145],
  'Jd Gabriela': [-23.5412, -46.8965],
  'Jd Marília': [-23.5368, -46.9015],
  'Vila Godinho': [-23.5238, -46.9092],
  'Jd Nossa Senhora de Fátima': [-23.5185, -46.9152],
  'Jd Lindomar II': [-23.5325, -46.9185],
  'Vale do Sol': [-23.5452, -46.9078],
  'Vila Eunice': [-23.5262, -46.8995],

  // ITAPEVI (centro -23.548, -46.932)
  'Vl São Francisco': [-23.5432, -46.9285],
  'Vl Dr Cardoso': [-23.5365, -46.9198],
  'Jd Santa Rita': [-23.5582, -46.9412],
  'Santa Flora': [-23.5645, -46.9785],
  'Centro Itapevi': [-23.5485, -46.9322],
  'Amador Bueno': [-23.5512, -46.9945],
  'Jd Portela': [-23.5525, -46.9245],
  'Jd Jurema': [-23.5445, -46.9365],
  'Vila Nova Itapevi': [-23.5415, -46.9385],
  'Ambuitá': [-23.5468, -46.9825],
  'Pq Miraflor': [-23.5615, -46.9275],
  'Jd Bela Vista': [-23.5395, -46.9455],
  'Pq Suburbano': [-23.5542, -46.9485],
  'Pq Boa Esperança': [-23.5715, -46.9525],
  'Cohab II': [-23.5625, -46.9365],
  'Jd Julieta': [-23.5478, -46.9515],
  'Jd Briquet': [-23.5515, -46.9395],
  'Jd Paulista Itapevi': [-23.5565, -46.9315],

  // PIRAPORA DO BOM JESUS (centro -23.398, -47.001)
  'Vila Nova Pirapora': [-23.3955, -46.9985],
  'Pq Payol': [-23.4125, -46.9812]
};

console.log('Bairros cadastrados:', Object.keys(BAIRRO_COORDS).length);
