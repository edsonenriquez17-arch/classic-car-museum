/* ============================================================
   ARTECH — contenido real extraído de la web del museo
   (carta, experiencias, talleres, galería, imágenes)
   Bancos de imágenes = rutas same-origin en ../assets/media/*
   ============================================================ */
'use strict';

/* Imágenes reales del sitio (webp) para cada apartado */
const IMG = {
  heroPool: [
    '../assets/media/lp06/hero-red-1920.webp',
    '../assets/media/lp06/hero-classic-1920.webp',
    '../assets/media/lp06/hero-white-1920.webp'
  ],
  gallery: [
    'a88a0606','a88a0608','a88a0613','a88a0622','a88a0623','a88a0633',
    'a88a0641','a88a0643','a88a0662','a88a0694','a88a0702','a88a0813','a88a0821','a88a0921'
  ].map(b => `../assets/media/b05/${b}-1280.webp`),
  dining: '../assets/media/lp06/dining-1280.webp',
  atelier: '../assets/media/lp06/atelier-1280.webp',
  restaurant: '../assets/media/b06/restaurant-table-1280.webp',
  restaurantWide: '../assets/media/p06/restaurant-wide.webp',
  workshopWide: '../assets/media/p06/workshop-wide.webp',
  workshopMechanics: '../assets/media/b023/workshop-mechanics-1280.webp',
  workshopClassic: '../assets/media/e362/workshop-classic-1280.webp',
  cockpit: '../assets/media/b023/cockpit-1280.webp',
  interior: '../assets/interior.png',
  porsche: '../assets/media/p08/porsche-interior.webp',
  exp: {
    collection: '../assets/media/e361/red-exterior.webp',
    vip: '../assets/media/e361/classic-exterior.webp',
    private: '../assets/media/e361/white-exterior.webp'
  }
};

/* Experiencias / entradas (reales) */
const EXPERIENCES = [
  { id: 'collection', price: 80, min: 60, guests: 1, img: IMG.exp.collection,
    es: { name: 'Experiencia ARTECH', info: 'Recorrido por la colección' },
    en: { name: 'ARTECH Experience', info: 'A journey through the collection' } },
  { id: 'vip', price: 120, min: 90, guests: 1, img: IMG.exp.vip,
    es: { name: 'Experiencia VIP', info: 'Museo + visita guiada al taller' },
    en: { name: 'VIP Experience', info: 'Museum + guided workshop visit' } },
  { id: 'private', price: 450, min: 150, guests: 15, img: IMG.exp.private,
    es: { name: 'Experiencia privada', info: 'Desde 15 personas · Previa coordinación' },
    en: { name: 'Private Experience', info: 'From 15 people · By arrangement' } }
];

/* Talleres afiliados (reales) */
const CRITERIOS = [
  { k: 'cromado',  es: 'Cromado',            en: 'Chrome' },
  { k: 'mecanica', es: 'Mecánica',           en: 'Mechanics' },
  { k: 'pintura',  es: 'Planchado y pintura', en: 'Bodywork & paint' },
  { k: 'tiempo',   es: 'Tiempo',             en: 'Turnaround' },
  { k: 'precio',   es: 'Precio',             en: 'Value' }
];
const WORKSHOP_PRINCIPAL = {
  n: 'INDICARS', z: 'Lima, Perú', img: IMG.workshopMechanics,
  es: { e: 'Restauración integral · piezas fabricadas en casa',
        d: 'INDICARS fabrica y arregla cada pieza que necesita un auto, una por una. Los vehículos clásicos se devuelven a su estado original y algunos se modernizan cuando el proyecto lo pide. Es el taller detrás de las restauraciones de esta colección.' },
  en: { e: 'Full restoration · parts made in-house',
        d: 'INDICARS manufactures and repairs every part a car needs, one piece at a time. Classic vehicles are returned to their original condition; some are modernized when the project calls for it. It is the workshop behind the restorations of this collection.' },
  p: { cromado: 3, mecanica: 3, pintura: 3, tiempo: 3, precio: 2 },
  obras: ['Auburn 852 Supercharged', 'Volvo P1800', 'Porsche 930 Turbo', 'Dodge Challenger R/T']
};
const WORKSHOPS = [
  { n: 'RP Alta Gama', z: 'Lima, Perú', img: IMG.workshopClassic,
    es: { e: 'Planchado y pintura de alta gama' }, en: { e: 'High-end bodywork and paint' },
    p: { cromado: 3, mecanica: 2, pintura: 3, tiempo: 2, precio: 2 } },
  { n: 'Carmelo Service', z: 'Lima, Perú', img: IMG.cockpit,
    es: { e: 'Mecánica y mantenimiento' }, en: { e: 'Mechanics and maintenance' },
    p: { cromado: 2, mecanica: 3, pintura: 2, tiempo: 3, precio: 3 } },
  { n: 'Germania Automotriz', z: 'Lima, Perú', img: IMG.porsche,
    es: { e: 'Especialistas europeos' }, en: { e: 'European marque specialists' },
    p: { cromado: 2, mecanica: 3, pintura: 2, tiempo: 2, precio: 2 } }
];

/* Carta del restaurante (real, bilingüe) + imágenes de plato */
const CAFE_DISH = {
  'Burrata Capresse':'dish-burrata','Ensalada de Cangrejo':'dish-crab','Ensalada César':'dish-caesar',
  'Crema de Racacha':'dish-soup','Papas Trufadas y Parmesano':'dish-fries','Pulpo Parrillero':'dish-pulpo',
  'Bife Americano a la Parrilla':'dish-bife','Huevos Benedictos ARTECH':'dish-breakfast','Butifarra':'dish-sandwich',
  'Soufflé de Chocolate':'dish-dessert','Espresso':'dish-coffee',
  'Limonada · Limonada de Hierba Luisa':'dish-lemonade','Cócteles':'dish-bar'
};
const CAFE_CAT_IMG = ['dish-burrata','dish-soup','dish-fries','dish-pulpo','dish-bife','dish-breakfast','dish-sandwich','dish-dessert','dish-coffee','dish-lemonade','dish-bar'];

const CAFE_MENU = [
 {t:{en:'Salads',es:'Ensaladas'},items:[
   {n:'Burrata Capresse',d:'Tomate, pesto, pistachos, reducción de balsámico, arúgula, cilantro, aceite de oliva.'},
   {n:'Ensalada de Cangrejo',d:'Pulpa de cangrejo, pepino rallado, zanahoria rayada, mayonesa de la casa, cebolla crocante.'},
   {n:'Ensalada César',d:'Mix de lechugas, parmesano reggiano, tocino, crotones de poro gluten free.'}]},
 {t:{en:'Soups & Creams',es:'Sopas y Cremas'},items:[
   {n:'Crema de Racacha',d:''},{n:'Sopa de la Semana',d:''}]},
 {t:{en:'Sides & Extras',es:'Acompañamientos y Extras'},items:[
   {n:'Papas Trufadas y Parmesano',d:'Parmesano rallado, perejil y trufa blanca.'},
   {n:'Verduras a la Parrilla',d:'Espárragos, loche, zucchini, tomate cherry, champiñones.'},
   {n:'Ensaladita Fresca ARTECH',d:''}]},
 {t:{en:'To Share',es:'Para Picar'},items:[
   {n:'Dip de Cangrejo Caliente',d:'Relleno dentro de un pan de masa madre.'},
   {n:'Tartare de Atún',d:'Atún, ajonjolí, alcaparras, palta y mango.'},
   {n:'Mollejas USA',d:''},
   {n:'Tequeños de Queso Cajamarquino',d:'Queso auténtico cajamarquino artesanal, guacamole.'},
   {n:'Bolitas de Racacha',d:'Relleno de jamón serrano y queso, salsa huacatay.'},
   {n:'Tortilla de Langostinos',d:'Huevos batidos, langostinos jumbo, salsa criolla y pan.'},
   {n:'Pulpo Parrillero',d:'Pulpo a la parrilla acompañado de puré de racacha.'},
   {n:'Cebiche al Estilo ARTECH',d:'Pesca del día, camote confitado, choclo, palta, cebolla, canchita, al limón.'}]},
 {t:{en:'Mains',es:'Segundos'},items:[
   {n:'Penne con Tomates Confitados y Pulpo',d:'Pulpo, tomates secos al ajo, parmesano reggiano.'},
   {n:'Ravioles de la Semana',d:'Pregunta por nuestro especial del día.'},
   {n:'Lasagna de la Semana',d:'Pregunta por nuestro especial del día.'},
   {n:'Bife Americano a la Parrilla',d:'Acompañado de papas fritas y ensaladita fresca.'},
   {n:'Panceta Laqueada en Salsa Miso y Chaufa',d:'Jugosa y crocante panceta sobre arroz chaufa.'},
   {n:'Atún en Costra de Pimienta',d:'Puré de racacha, verduras parrilleras.'},
   {n:'Seco de Pescado',d:'Plato del norte, acompañado de yuca y arroz.'}]},
 {t:{en:'Breakfast',es:'Desayunos'},items:[
   {n:'Huevos Benedictos ARTECH',d:'Tostón de pan campesino, tocino, huevos escalfados, palta y salsa holandesa.'},
   {n:'Tostón de Pesto',d:'Tomates confitados, pesto, queso de cabra.'},
   {n:'Huevos Revueltos, Escalfados o Fritos',d:'Acompañados de tostadas de pan campesino.'}]},
 {t:{en:'Sandwiches & Breads',es:'Sándwiches y Panes'},items:[
   {n:'Hamburguesa en Pan de Camote (Gluten Free)',d:'Casera de res, lechuga, tomate, cheddar, tocino.'},
   {n:'Butifarra',d:'Jamón del país, salsa criolla, mayonesa de la casa y Dijon.'},
   {n:'Hamburguesa de Atún',d:'Trozos de atún término medio, palta, mayonesa de la casa.'},
   {n:'Sándwich de Panceta',d:'Panceta laqueada en miso, mayonesa de ajo confitado, nabo encurtido.'},
   {n:'Croissant',d:'Jamón y queso · mantequilla.'},
   {n:'Croque Madame',d:'Pan campesino, jamón inglés, queso y bechamel, huevo frito.'}]},
 {t:{en:'Desserts',es:'Postres'},items:[
   {n:'Suspiro de Lúcuma',d:''},
   {n:'Keke de Zanahoria (Gluten Free)',d:'Helado de vainilla y frosting de queso crema.'},
   {n:'Crocante de Manzana',d:'Helado de vainilla.'},
   {n:'Pie de Limón',d:''},
   {n:'Soufflé de Chocolate',d:'Helado de vainilla y culí de frambuesas.'},
   {n:'Brownies y Blondies (Gluten Free)',d:''}]},
 {t:{en:'Hot Drinks',es:'Bebidas Calientes'},items:[
   {n:'Espresso',d:''},{n:'Cappuccino',d:''},{n:'Americano',d:''},
   {n:'Manzanilla, Hierba Luisa o Menta Naturales',d:''},{n:'Chocolate Caliente ARTECH',d:''}]},
 {t:{en:'Cold Drinks, Milkshakes & Juices',es:'Bebidas Frías, Milkshakes y Jugos'},items:[
   {n:'Latte',d:''},
   {n:'Milkshake de Vainilla, Chocolate, Fresa o Lúcuma',d:''},
   {n:'Jugo de Naranja, Fresa o Lúcuma',d:''},
   {n:'Limonada · Limonada de Hierba Luisa',d:''},
   {n:'Maracuyá · Chicha Morada',d:''},
   {n:'Coca Cola · Inka Cola · Agua',d:''}]},
 {t:{en:'Bar — Wines, Cocktails & Beers',es:'Bar — Vinos, Cócteles y Cervezas'},items:[
   {n:'Vinos',d:'Tinto · Blanco · Rosé.'},
   {n:'Cócteles',d:'Pisco Sour · Pisco Punch de Chicha · Maracuyá Sour.'},
   {n:'Cervezas',d:'Artesanal · Pilsen · Heineken.'}]}
];
const CAFE_EN = {
 'Burrata Capresse':{n:'Burrata Capresse',d:'Tomato, pesto, pistachios, balsamic reduction, arugula, cilantro, olive oil.'},
 'Ensalada de Cangrejo':{n:'Crab Salad',d:'Crab meat, grated cucumber and carrot, house mayonnaise, crispy onion.'},
 'Ensalada César':{n:'Caesar Salad',d:'Mixed lettuce, Parmesan, bacon, gluten-free leek croutons.'},
 'Crema de Racacha':{n:'Arracacha Cream Soup',d:''},'Sopa de la Semana':{n:'Soup of the Week',d:''},
 'Papas Trufadas y Parmesano':{n:'Truffled Parmesan Fries',d:'Grated Parmesan, parsley and white truffle.'},
 'Verduras a la Parrilla':{n:'Grilled Vegetables',d:'Asparagus, loche squash, zucchini, cherry tomato, mushrooms.'},
 'Ensaladita Fresca ARTECH':{n:'ARTECH Fresh Side Salad',d:''},
 'Dip de Cangrejo Caliente':{n:'Warm Crab Dip',d:'Served inside a sourdough loaf.'},
 'Tartare de Atún':{n:'Tuna Tartare',d:'Tuna, sesame, capers, avocado and mango.'},
 'Mollejas USA':{n:'USDA Sweetbreads',d:''},
 'Tequeños de Queso Cajamarquino':{n:'Cajamarca Cheese Tequeños',d:'Artisan Cajamarca cheese, guacamole.'},
 'Bolitas de Racacha':{n:'Arracacha Croquettes',d:'Filled with Serrano ham and cheese, huacatay sauce.'},
 'Tortilla de Langostinos':{n:'Prawn Omelette',d:'Beaten eggs, jumbo prawns, criolla salsa and toasted bread.'},
 'Pulpo Parrillero':{n:'Grilled Octopus',d:'Grilled octopus with arracacha purée.'},
 'Cebiche al Estilo ARTECH':{n:'ARTECH-Style Ceviche',d:'Catch of the day, candied sweet potato, corn, avocado, onion, cancha.'},
 'Penne con Tomates Confitados y Pulpo':{n:'Penne with Confit Tomato & Octopus',d:'Octopus, garlic sun-dried tomatoes, Parmesan.'},
 'Ravioles de la Semana':{n:'Ravioli of the Week',d:'Ask for our daily special.'},
 'Lasagna de la Semana':{n:'Lasagna of the Week',d:'Ask for our daily special.'},
 'Bife Americano a la Parrilla':{n:'Grilled American Steak',d:'Served with fries and a fresh side salad.'},
 'Panceta Laqueada en Salsa Miso y Chaufa':{n:'Miso-Glazed Pork Belly with Chaufa',d:'Juicy, crisp pork belly over chaufa fried rice.'},
 'Atún en Costra de Pimienta':{n:'Pepper-Crusted Tuna',d:'Served with arracacha purée and grilled vegetables.'},
 'Seco de Pescado':{n:'Northern Fish Seco',d:'A northern-Peru classic, served with cassava and rice.'},
 'Huevos Benedictos ARTECH':{n:'ARTECH Eggs Benedict',d:'Country-bread toast, bacon, poached eggs, avocado and hollandaise.'},
 'Tostón de Pesto':{n:'Pesto Toast',d:'Confit tomato, pesto, goat cheese.'},
 'Huevos Revueltos, Escalfados o Fritos':{n:'Eggs Your Way — Scrambled, Poached or Fried',d:'Served with country-bread toast.'},
 'Hamburguesa en Pan de Camote (Gluten Free)':{n:'Sweet-Potato Bun Burger (Gluten Free)',d:'House beef patty, lettuce, tomato, cheddar, bacon.'},
 'Butifarra':{n:'Butifarra — Peruvian Ham Sandwich',d:'Country ham, criolla salsa, house mayo and Dijon.'},
 'Hamburguesa de Atún':{n:'Tuna Burger',d:'Medium-rare tuna, avocado, house mayo, sacha tomato, shallots.'},
 'Sándwich de Panceta':{n:'Pork Belly Sandwich',d:'Miso-glazed pork belly, confit-garlic mayo, pickled turnip.'},
 'Croissant':{n:'Croissant',d:'Ham & cheese · butter.'},
 'Croque Madame':{n:'Croque Madame',d:'Country bread, English ham, cheese and béchamel, fried egg.'},
 'Suspiro de Lúcuma':{n:'Lúcuma Suspiro',d:''},
 'Keke de Zanahoria (Gluten Free)':{n:'Carrot Cake (Gluten Free)',d:'Vanilla ice cream and cream-cheese frosting.'},
 'Crocante de Manzana':{n:'Apple Crumble',d:'Vanilla ice cream.'},
 'Pie de Limón':{n:'Lime Pie',d:''},
 'Soufflé de Chocolate':{n:'Chocolate Soufflé',d:'Vanilla ice cream and raspberry coulis.'},
 'Brownies y Blondies (Gluten Free)':{n:'Brownies & Blondies (Gluten Free)',d:''},
 'Espresso':{n:'Espresso',d:''},'Cappuccino':{n:'Cappuccino',d:''},'Americano':{n:'Americano',d:''},
 'Manzanilla, Hierba Luisa o Menta Naturales':{n:'Chamomile, Lemon Verbena or Fresh Mint Tea',d:''},
 'Chocolate Caliente ARTECH':{n:'ARTECH Hot Chocolate',d:''},'Latte':{n:'Latte',d:''},
 'Milkshake de Vainilla, Chocolate, Fresa o Lúcuma':{n:'Vanilla, Chocolate, Strawberry or Lúcuma Milkshake',d:''},
 'Jugo de Naranja, Fresa o Lúcuma':{n:'Orange, Strawberry or Lúcuma Juice',d:''},
 'Limonada · Limonada de Hierba Luisa':{n:'Lemonade · Lemon-Verbena Lemonade',d:''},
 'Maracuyá · Chicha Morada':{n:'Passion Fruit · Chicha Morada',d:''},
 'Coca Cola · Inka Cola · Agua':{n:'Coca-Cola · Inca Kola · Water',d:''},
 'Vinos':{n:'Wines',d:'Red · White · Rosé.'},
 'Cócteles':{n:'Cocktails',d:'Pisco Sour · Chicha Pisco Punch · Passion Fruit Sour.'},
 'Cervezas':{n:'Beers',d:'Craft · Pilsen · Heineken.'}
};

const WHATSAPP = '51992432455';
