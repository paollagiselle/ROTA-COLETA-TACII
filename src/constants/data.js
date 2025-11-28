// src/constants/data.js

// 1. Definição dos Tipos de Resíduos e Cores (Chaves internas em minúsculo, sem acento)
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
  
  // Mapeamento de cor por RÓTULO (Para componentes que usam o nome completo, mas agora aceita variações)
  export const TIPO_COR_MAP = {
    'Orgânico': TIPOS_RESIDUOS.organico.cor,
    'Reciclável': TIPOS_RESIDUOS.reciclavel.cor,
    'Eletrônico': TIPOS_RESIDUOS.eletronico.cor,
    // NOVO: Adiciona chaves sem acento para tolerância a erros do DB:
    'Organico': TIPOS_RESIDUOS.organico.cor,
    'Reciclavel': TIPOS_RESIDUOS.reciclavel.cor, // <--- ESTA CHAVE CORRIGE O PROBLEMA DA CARLA
    'Eletronico': TIPOS_RESIDUOS.eletronico.cor,
  };
  
  // 2. Mapeamento de Pontos para Tipos (Usado em PlanejarRotaScreen.js para filtragem)
  export const PONTOS_MAPA_RESIDUOS = {
    A: ['eletronico', 'organico'],
    B: ['organico', 'reciclavel'],
    C: ['reciclavel', 'eletronico'],
    D: ['organico'],
    E: ['reciclavel'],
  };