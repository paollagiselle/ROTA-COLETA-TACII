export const TIPOS_RESIDUOS = {
    organico: {
      label: 'Orgânico',
      cor: '#27ae60', // Verde
    },
    reciclavel: {
      label: 'Reciclável',
      cor: '#f1c40f', // Amarelo
    },
    eletronico: {
      label: 'Eletrônico',
      cor: '#3498db', // Azul
    },
  };
  
  export const TIPO_COR_MAP = {
    'Orgânico': TIPOS_RESIDUOS.organico.cor,
    'Reciclável': TIPOS_RESIDUOS.reciclavel.cor,
    'Eletrônico': TIPOS_RESIDUOS.eletronico.cor,

    'Organico': TIPOS_RESIDUOS.organico.cor,
    'Reciclavel': TIPOS_RESIDUOS.reciclavel.cor, 
    'Eletronico': TIPOS_RESIDUOS.eletronico.cor,
  };
  
  export const PONTOS_MAPA_RESIDUOS = {
    A: ['eletronico', 'organico'],
    B: ['organico', 'reciclavel'],
    C: ['reciclavel', 'eletronico'],
    D: ['organico'],
    E: ['reciclavel'],
  };