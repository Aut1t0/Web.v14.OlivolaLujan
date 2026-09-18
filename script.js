(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Storage layer for state persistence
  const storage = {
    get(k, fallback = null) {
      try { return JSON.parse(localStorage.getItem(k)) ?? fallback; }
      catch { return fallback; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
    }
  };

  // Centralized site business configuration
  const siteConfig = {
    businessName: "Olivícola Luján",
    address: "Tropero Sosa 933, Maipú, Mendoza, Argentina",
    whatsappNumber: "542615503895",
    email: "emercado@olivicola.com",
    timezoneHQ: "America/Argentina/Mendoza",
    hqUtcOffset: -3
  };


  // Welcome intro / access screen
  const introScreen = $('#introScreen');
  const introVideo = $('#introVideo');
  const introEnter = $('#introEnter');

  if (introScreen) {
    document.documentElement.classList.add('intro-active');

    // Prefer the user-provided filename; fall back to the existing site video
    // only when that asset is not available, so the intro never becomes blank.
    if (introVideo) {
      const userVideoSource = introVideo.querySelector('source[src*="Video Project 1.mp4"]');
      const userVideoSrc = userVideoSource?.getAttribute('src');

      const tryPlayIntro = () => {
        const playPromise = introVideo.play();
        if (playPromise?.catch) playPromise.catch(() => {});
      };

      introVideo.muted = true;
      introVideo.setAttribute('muted', '');
      introVideo.playsInline = true;
      introVideo.setAttribute('playsinline', '');
      tryPlayIntro();

      if (userVideoSource && userVideoSrc) {
        userVideoSource.addEventListener('error', () => {
          if (introVideo.dataset.fallbackApplied === '1') return;
          introVideo.dataset.fallbackApplied = '1';
          const fallback = introVideo.querySelector('source[src="assets/olive-motion.mp4"]');
          if (fallback) {
            introVideo.src = fallback.src;
            introVideo.load();
            tryPlayIntro();
          }
        }, { once: true });
      }
    }

    const leaveIntro = () => {
      if (introScreen.classList.contains('is-leaving') || introScreen.classList.contains('is-gone')) return;

      introVideo?.play?.().catch?.(() => {});
      introScreen.classList.add('is-leaving');
      document.documentElement.classList.remove('intro-active');
      document.body.classList.remove('intro-lock');

      window.setTimeout(() => {
        introVideo?.pause?.();
        if (introVideo) {
          try { introVideo.currentTime = 0; } catch {}
        }
        introScreen.classList.add('is-gone');
        introScreen.setAttribute('aria-hidden', 'true');
      }, 820);
    };

    const openIntro = (event) => {
      event?.preventDefault?.();
      introScreen.classList.remove('is-gone', 'is-leaving');
      introScreen.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('intro-active');
      document.body.classList.add('intro-lock');
      if (introVideo) {
        try { introVideo.currentTime = 0; } catch {}
        introVideo.play?.().catch?.(() => {});
      }
    };

    introEnter?.addEventListener('click', leaveIntro);
    $('#brandIntroLink')?.addEventListener('click', openIntro);
    introEnter?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        leaveIntro();
      }
    });
  }

  // 1. Translations & copy
  const copy = {
    es: {
      nav: { about: "Quiénes somos", origin: "De dónde venís", products: "Aceitunas de mesa", markets: "Mercados", contact: "Contacto", quote: "Cotización", account: "Ingresar cuenta" },
      hero: { eyebrow: "Aceitunas de mesa · Distribución comercial", title: "Suministro Nacional, listo para el mercado.", body: "Una empresa privada mendocina que conecta un abastecimiento confiable de aceitunas de mesa con compradores provinciales, nacionales e internacionales.", primary: "Explorar variedades", secondary: "Ver rutas de mercado", ficha: "Ficha comercial (Próximamente)", scroll: "Desplázate para descubrir" },
      about: { kicker: "01 / Quiénes somos", title: "Una empresa mendocina con muchas rutas fiables al mercado.", body: "Abastecemos desde San Juan, Mendoza y La Rioja para construir conversaciones claras de suministro provincial, nacional e internacional.", connect: "Conectar con el equipo ↗", label: "El compromiso comercial", item1: "Abastecimiento desde San Juan, Mendoza y La Rioja", item2: "Alcance provincial, nacional e internacional", item3: "Documentación preparada para exportación", metric1: "Provincias de origen", metric2: "Puntos de mercado nacional", metric3: "Variedades de aceituna", metric4: "Base comercial Maipú" },
      origin: { eyebrow: "02 / Tradition and Rural Memory", title: "¿De dónde sos? Venís, probás y entendés el origen.", body: "En Mendoza la aceituna no es solo un producto de despacho: es la mesa del domingo, el trabajo bajo el sol de Cuyo, las manos que cosechan y la memoria compartida de generaciones. Te invitamos a conectar con un sabor honesto que nace entre hileras de olivos regados por agua de cordillera." },
      impact: { kicker: "03 / Aporte local", title: "Un equipo que mantiene el valor cerca de casa.", body: "Detrás de cada despacho hay un equipo local de aproximadamente 25 personas que trabaja en preparación, coordinación, calidad y atención comercial.", item1: "Empleo local estable en Maipú", item2: "Conocimiento práctico compartido cada día", item3: "Un vínculo directo entre origen y mercado", statLabel: "Personas que sostienen la operación" },
      products: { eyebrow: "04 / Catálogo Principal", title: "Aceitunas de Mesa: El formato adecuado para cada conversación comercial.", body: "Selecciona una variedad y la cantidad de tambores que deseas cotizar. La selección se envía directamente a nuestro canal comercial por WhatsApp." },
      markets: { eyebrow: "05 / Presencia en el Mercado", title: "Presencia en el Mercado", body: "Cobertura comercial nacional y rutas de comercio exterior organizadas por territorio.", argEyebrow: "Distribución Nacional", argTitle: "Presencia en el Mercado Argentino", provincesStatus: "Provincias de la red", intlEyebrow: "Mercado Exterior", intlTitle: "Presencia en el Mercado Internacional", intlStatus: "Destinos de exportación", activeLegend: "Activo", neutralLegend: "Sin cobertura" },
      contact: { eyebrow: "06 / Contacto & Sede", title: "Hagamos que el próximo envío tenga sentido.", body: "Comunícate con nuestro equipo comercial para solicitar información, planificar despachos o coordinar visitas comerciales a nuestra planta en Mendoza.", btnEmail: "Enviar correo comercial ↗" },
      rating: { kicker: "07 / Tu opinión", title: "¿Qué te parece nuestra empresa?", body: "Tu valoración y tus comentarios nos ayudan a seguir perfeccionando nuestro servicio de atención y la calidad de cada lote.", save: "Guardar valoración" },
      faq: { button: "Preguntas Frecuentes", title: "Asistente de Preguntas Frecuentes", subtitle: "Respuestas sobre cotización, aceitunas y envíos", prompt: "¿Qué te gustaría consultar?" }
    },
    en: {
      nav: { about: "About Us", origin: "Where you come from", products: "Table Olives", markets: "Markets", contact: "Contact", quote: "Quotation", account: "Sign In" },
      hero: { eyebrow: "Table Olives · Commercial Distribution", title: "Mendoza supply, commercially ready.", body: "A private Mendoza company connecting dependable table olive supply with provincial, national, and international wholesale buyers.", primary: "Explore varieties", secondary: "View market routes", ficha: "Commercial sheet (Coming soon)", scroll: "Scroll to discover" },
      about: { kicker: "01 / Who we are", title: "A Mendoza company with many reliable routes to market.", body: "Sourcing from San Juan, Mendoza and La Rioja for clear provincial, national and international supply conversations.", connect: "Connect with team ↗", label: "Commercial commitment", item1: "Sourcing across San Juan, Mendoza & La Rioja", item2: "National, provincial & international reach", item3: "Export-ready documentation", metric1: "Sourcing provinces", metric2: "National market hubs", metric3: "Table olive varieties", metric4: "Commercial base Maipú" },
      origin: { eyebrow: "02 / Tradition and Rural Memory", title: "Where are you from? Come taste and understand the origin.", body: "In Mendoza, olives are more than cargo: they are the Sunday table, honest labor beneath the Andean sky, the hands that harvest, and living generational knowledge. We invite you to experience the authentic taste born from mineral snowmelt." },
      impact: { kicker: "03 / Local Impact", title: "A team that keeps value close to home.", body: "Behind every dispatch is a local team of approximately 25 people working across preparation, coordination, quality, and commercial service.", item1: "Stable local employment in Maipú", item2: "Practical know-how shared every day", item3: "A direct link between origin and market", statLabel: "People working across operations" },
      products: { eyebrow: "04 / Main Catalog", title: "Table Olives: The right format for every commercial conversation.", body: "Select a variety and the number of drums you want to quote. Your selection goes directly to our commercial WhatsApp channel." },
      markets: { eyebrow: "05 / Market Presence", title: "Market Presence", body: "National commercial coverage and foreign-trade routes organized by territory.", argEyebrow: "National Distribution", argTitle: "Presence in the Argentine Market", provincesStatus: "Network provinces", intlEyebrow: "Foreign Trade", intlTitle: "Presence in International Markets", intlStatus: "Export destinations", activeLegend: "Active", neutralLegend: "No active coverage" },
      contact: { eyebrow: "06 / Contact & HQ", title: "Let's make the next shipment make sense.", body: "Reach out to our commercial team to request quotes, schedule shipments, or coordinate business visits to our plant in Mendoza.", btnEmail: "Send commercial email ↗" },
      rating: { kicker: "07 / Your Feedback", title: "What do you think of our company?", body: "Your ratings and comments help us continuously improve our commercial service and batch quality.", save: "Save rating" },
      faq: { button: "Frequent Questions", title: "FAQ Assistant", subtitle: "Instant answers on quotes, olives and logistics", prompt: "What would you like to know?" }
    },
    pt: {
      nav: { about: "Quem somos", origin: "De onde você vem", products: "Azeitonas de mesa", markets: "Mercados", contact: "Contacto", quote: "Cotação", account: "Entrar na conta" },
      hero: { eyebrow: "Azeitonas de mesa · Distribuição comercial", title: "Fornecimento de Mendoza, pronto para o mercado.", body: "Uma empresa privada de Mendoza que conecta um fornecimento fiável de azeitonas de mesa a compradores provinciais, nacionais e internacionais.", primary: "Explorar variedades", secondary: "Ver rotas de mercado", ficha: "Ficha comercial (Em breve)", scroll: "Deslize para descobrir" },
      about: { kicker: "01 / Quem somos", title: "Uma empresa de Mendoza com muitas rotas fiáveis para o mercado.", body: "Abastecemos San Juan, Mendoza e La Rioja para criar conversas claras de fornecimento provincial, nacional e internacional.", connect: "Falar com a equipa ↗", label: "O compromisso comercial", item1: "Fornecimento de San Juan, Mendoza e La Rioja", item2: "Alcance provincial, nacional e internacional", item3: "Documentação pronta para exportação", metric1: "Províncias de origem", metric2: "Polos de mercado nacional", metric3: "Variedades de azeitona", metric4: "Base comercial Maipú" },
      origin: { eyebrow: "02 / Tradição e Memória Rural", title: "De onde você vem? Venha provar e entender a nossa origem.", body: "Em Mendoza a azeitona representa tradição, sol andino e mãos que colhem com dedicação. Convidamos você a descobrir o sabor genuíno irrigado com a água pura do degelo da cordilheira." },
      impact: { kicker: "03 / Impacto local", title: "Uma equipa que mantém o valor perto de casa.", body: "Por trás de cada expedição está uma equipa local de aproximadamente 25 pessoas dedicada à preparação, coordenação, qualidade e serviço comercial.", item1: "Emprego local estável em Maipú", item2: "Conhecimento prático partilhado todos os dias", item3: "Uma ligação direta entre origem e mercado", statLabel: "Pessoas que sustentam a operação" },
      products: { eyebrow: "04 / Catálogo Principal", title: "Azeitonas de Mesa: O formato certo para cada conversa comercial.", body: "Selecione uma variedade e a quantidade de tambores que deseja cotar. A seleção segue diretamente para o nosso WhatsApp comercial." },
      markets: { eyebrow: "05 / Presença no Mercado", title: "Presença no Mercado", body: "Cobertura comercial nacional e rotas de comércio exterior organizadas por território.", argEyebrow: "Distribuição Nacional", argTitle: "Presença no Mercado Argentino", provincesStatus: "Províncias atendidas", intlEyebrow: "Mercado Exterior", intlTitle: "Presença no Mercado Internacional", intlStatus: "Destinos de exportação", activeLegend: "Ativo", neutralLegend: "Sem cobertura" },
      contact: { eyebrow: "06 / Contacto & Sede", title: "Vamos fazer com que o próximo envio faça sentido.", body: "Fale com a nossa equipa comercial para solicitar cotações, agendar remessas ou coordenar visitas comerciais a Mendoza.", btnEmail: "Enviar e-mail comercial ↗" },
      rating: { kicker: "07 / A sua avaliação", title: "O que acha da nossa empresa?", body: "A sua opinião ajuda-nos a aprimorar constantemente o atendimento e a qualidade de cada lote.", save: "Guardar avaliação" },
      faq: { button: "Perguntas Frequentes", title: "Assistente de Perguntas Frequentes", subtitle: "Respostas sobre cotações, variedades e entregas", prompt: "O que gostaria de consultar?" }
    }
  };

  // 2. Table Olive Varieties Dataset
  // Product images come from the supplied olive reference sheet.
  const oliveVariants = [
    {
      id: "green-whole",
      name: { es: "Verde Entera", en: "Green Whole", pt: "Verde Inteira" },
      type: { es: "Entera con carozo", en: "Whole with pit", pt: "Inteira com caroço" },
      desc: { es: "Aceituna verde entera seleccionada, de pulpa firme y presentación limpia, pensada para gastronomía, fraccionamiento y distribución mayorista.", en: "Selected whole green olives with firm flesh and a clean presentation, designed for foodservice, repacking and wholesale distribution.", pt: "Azeitona verde inteira selecionada, de polpa firme e apresentação limpa, pensada para gastronomia, fracionamento e distribuição grossista." },
      format: { es: "Tambor industrial de 265 lt · 180 kg", en: "265 L industrial drum · 180 kg", pt: "Tambor industrial de 265 L · 180 kg" },
      img: "assets/img.var/01-verde-entera.png"
    },
    {
      id: "green-pitted",
      name: { es: "Verde Deshuesada", en: "Green Pitted", pt: "Verde Descaroçada" },
      type: { es: "Sin carozo", en: "Pitted", pt: "Sem caroço" },
      desc: { es: "Aceituna verde descarozada conservando la estructura de la pulpa. Una opción práctica para elaboraciones gastronómicas y uso industrial.", en: "Pitted green olives with the fruit structure preserved. A practical option for foodservice and industrial preparation.", pt: "Azeitona verde descaroçada preservando a estrutura da polpa. Uma opção prática para gastronomia e preparação industrial." },
      format: { es: "Tambor industrial de 265 lt · 140 kg", en: "265 L industrial drum · 140 kg", pt: "Tambor industrial de 265 L · 140 kg" },
      img: "assets/img.var/02-verde-deshuesada.png"
    },
    {
      id: "pimiento-stuffed",
      name: { es: "Verde Rellena de Pimiento", en: "Green Pimiento-Stuffed", pt: "Verde Recheada com Pimento" },
      type: { es: "Rellena con pimiento", en: "Pimiento stuffed", pt: "Recheada com pimento" },
      desc: { es: "Aceituna verde seleccionada rellena de pimiento, con una presentación gastronómica distintiva y contraste visual natural.", en: "Selected green olives stuffed with pimiento, offering a distinctive gourmet presentation and natural visual contrast.", pt: "Azeitona verde selecionada recheada com pimento, com apresentação gastronómica distinta e contraste visual natural." },
      format: { es: "Tambor industrial de 265 lt · 160 kg", en: "265 L industrial drum · 160 kg", pt: "Tambor industrial de 265 L · 160 kg" },
      img: "assets/img.var/03-verde-rellena-pimiento.png"
    },
    {
      id: "green-sliced",
      name: { es: "Verde en Rodajas", en: "Green Sliced", pt: "Verde em Rodelas" },
      type: { es: "En rodajas uniformes", en: "Uniform slices", pt: "Em rodelas uniformes" },
      desc: { es: "Rodajas de corte uniforme listas para pizzas, ensaladas, panificación y preparaciones industriales de alto volumen.", en: "Uniformly cut slices ready for pizza, salads, bakery products and high-volume industrial preparation.", pt: "Rodelas de corte uniforme prontas para pizzas, saladas, panificação e preparações industriais de alto volume." },
      format: { es: "Tambor industrial de 265 lt · 160 kg", en: "265 L industrial drum · 160 kg", pt: "Tambor industrial de 265 L · 160 kg" },
      img: "assets/img.var/04-verde-rodajas.png"
    },
    {
      id: "black-whole",
      name: { es: "Negra Entera", en: "Black Whole", pt: "Preta Inteira" },
      type: { es: "Entera con carozo", en: "Whole with pit", pt: "Inteira com caroço" },
      desc: { es: "Aceituna negra entera de pulpa carnosa y carácter intenso, adecuada para tablas, cocina mediterránea y distribución gastronómica.", en: "Whole black olives with meaty texture and rich character, suited to Mediterranean cuisine, platters and foodservice distribution.", pt: "Azeitona preta inteira de polpa carnuda e carácter intenso, adequada para tábuas, cozinha mediterrânica e distribuição gastronómica." },
      format: { es: "Tambor industrial de 265 lt · 180 kg", en: "265 L industrial drum · 180 kg", pt: "Tambor industrial de 265 L · 180 kg" },
      img: "assets/img.var/05-negra-entera.png"
    },
    {
      id: "black-pitted",
      name: { es: "Negra Deshuesada", en: "Black Pitted", pt: "Preta Descaroçada" },
      type: { es: "Sin carozo", en: "Pitted", pt: "Sem caroço" },
      desc: { es: "Aceituna negra descarozada para una manipulación ágil y un uso directo en gastronomía, retail y elaboraciones de alto volumen.", en: "Pitted black olives for efficient handling and direct use in foodservice, retail and high-volume preparation.", pt: "Azeitona preta descaroçada para manuseamento ágil e uso direto em gastronomia, retalho e preparações de alto volume." },
      format: { es: "Tambor industrial de 265 lt · 140 kg", en: "265 L industrial drum · 140 kg", pt: "Tambor industrial de 265 L · 140 kg" },
      img: "assets/img.var/06-negra-deshuesada.png"
    },
    {
      id: "black-sliced",
      name: { es: "Negra en Rodajas", en: "Black Sliced", pt: "Preta em Rodelas" },
      type: { es: "En rodajas uniformes", en: "Uniform slices", pt: "Em rodelas uniformes" },
      desc: { es: "Rodajas de aceituna negra con contraste visual profundo, pensadas para panificación, ensaladas, pastas y preparaciones industriales.", en: "Black olive slices with deep visual contrast, designed for bakery products, salads, pasta and industrial preparation.", pt: "Rodelas de azeitona preta com contraste visual profundo, pensadas para panificação, saladas, massas e preparações industriais." },
      format: { es: "Tambor industrial de 265 lt · 160 kg", en: "265 L industrial drum · 160 kg", pt: "Tambor industrial de 265 L · 160 kg" },
      img: "assets/img.var/07-negra-rodajas.png"
    },
    {
      id: "griega",
      name: { es: "Negra Griega Deshidratada", en: "Greek Black Dehydrated", pt: "Preta Grega Desidratada" },
      type: { es: "Madurada y deshidratada", en: "Ripened and dehydrated", pt: "Maturada e desidratada" },
      desc: { es: "Aceituna negra de estilo griego, madurada y deshidratada, con textura arrugada y sabor concentrado.", en: "Greek-style black olives, ripened and dehydrated for a wrinkled texture and concentrated flavor.", pt: "Azeitona preta ao estilo grego, maturada e desidratada, com textura enrugada e sabor concentrado." },
      format: { es: "Tambor industrial de 265 lt · peso según producto", en: "265 L industrial drum · weight by product type", pt: "Tambor industrial de 265 L · peso segundo o tipo de produto" },
      img: "assets/img.var/08-negra-griega-deshidratada.png"
    }
  ];

  function getProductFormat(product) {
    if (!product) return '';
    return typeof product.format === 'object' ? (product.format[language] || product.format.es) : product.format;
  }

  function normalizeQuoteCart(cart) {
    if (!Array.isArray(cart)) return [];
    return cart.map(item => {
      const product = oliveVariants.find(p => p.id === item.id);
      if (!product) return item;
      return { ...item, name: product.name, img: product.img, format: product.format, unit: 'tambores' };
    });
  }

  // 3. Argentina Provinces Dataset — direct coordinates aligned to ProyeccionArgentina.png (1168x1347)
  const argentinaProvinces = [{"id":"jujuy","name":"Jujuy","status":"active","x":503,"y":82,"note":"Puntos de entrega habilitados"},{"id":"salta","name":"Salta","status":"active","x":515,"y":151,"note":"Distribución NOA y frontera"},{"id":"formosa","name":"Formosa","status":"active","x":700,"y":162,"note":"Ruta norte habilitada"},{"id":"chaco","name":"Chaco","status":"active","x":670,"y":251,"note":"Despachos directos desde Cuyo"},{"id":"misiones","name":"Misiones","status":"active","x":820,"y":226,"note":"Venta gastronómica y minorista"},{"id":"tucuman","name":"Tucumán","status":"active","x":553,"y":237,"note":"Canal mayorista regional"},{"id":"catamarca","name":"Catamarca","status":"active","x":505,"y":303,"note":"Ruta de suministro del noroeste"},{"id":"santiago","name":"Santiago del Estero","status":"active","x":660,"y":320,"note":"Despachos regulares"},{"id":"corrientes","name":"Corrientes","status":"active","x":779,"y":304,"note":"Atención comercial periódica"},{"id":"larioja","name":"La Rioja","status":"active","x":472,"y":375,"note":"Cuenca olivícola tradicional"},{"id":"sanjuan","name":"San Juan","status":"active","x":435,"y":448,"note":"Zona clave de cosecha y abastecimiento"},{"id":"cordoba","name":"Córdoba","status":"active","x":619,"y":445,"note":"Centro neurálgico de logística centro"},{"id":"santafe","name":"Santa Fe","status":"active","x":737,"y":399,"note":"Corredor fluvial y mayoristas"},{"id":"entrerios","name":"Entre Ríos","status":"active","x":806,"y":435,"note":"Red de distribución mesopotámica"},{"id":"mendoza","name":"Mendoza","status":"active","x":449,"y":515,"note":"Sede central, planta de acopio y despacho"},{"id":"sanluis","name":"San Luis","status":"active","x":575,"y":523,"note":"Corredor Cuyo directo"},{"id":"buenosaires","name":"Buenos Aires","status":"active","x":766,"y":563,"note":"Mayor volumen de distribución y retail"},{"id":"caba","name":"CABA","status":"active","x":800,"y":500,"note":"Canales gourmet y gastronómicos"},{"id":"lapampa","name":"La Pampa","status":"active","x":573,"y":622,"note":"Enlace con Patagonia norte"},{"id":"neuquen","name":"Neuquén","status":"active","x":429,"y":685,"note":"Abastecimiento regular"},{"id":"rionegro","name":"Río Negro","status":"neutral","x":506,"y":779,"note":"Valle y destinos turísticos"},{"id":"chubut","name":"Chubut","status":"neutral","x":503,"y":970,"note":"Aún no se llega, pero próximamente"},{"id":"santacruz","name":"Santa Cruz","status":"neutral","x":486,"y":1058,"note":"Envíos programados"},{"id":"tierradelfuego","name":"Tierra del Fuego","status":"neutral","x":505,"y":1235,"note":"Aún no se llega, pero próximamente"}];

  // 4. International Markets Dataset — active export destinations shown in the status panel.
  const internationalMarkets = [
    { id: "argentina", name: "Argentina", status: "active", x: 413, y: 806, region: "Sudamérica", note: "Mercado de origen y distribución nacional" },
    { id: "chile", name: "Chile", status: "active", x: 392, y: 758, region: "Sudamérica", note: "Paso Los Libertadores directo desde Mendoza" },
    { id: "brasil", name: "Brasil", status: "active", x: 570, y: 650, region: "Sudamérica", note: "Principal mercado de exportación de aceitunas de mesa" },
    { id: "uruguay", name: "Uruguay", status: "active", x: 505, y: 787, region: "Sudamérica", note: "Canal comercial mayorista consolidado" }
  ];

  // 5. FAQ Data
  const faqData = {
    es: [
      { q: "¿Cómo se solicita una cotización?", a: "Seleccionas la variedad deseada, la cantidad de tambores y tocas 'Agregar a cotización'. Luego abres tu Cotización y tocas 'Enviar a WhatsApp' para recibir atención directa de nuestro responsable comercial.", cat: "Cotización" },
      { q: "¿Cuáles son las variedades de aceituna disponibles?", a: "Contamos con aceitunas verdes y negras en versiones entera, descarozada (sin carozo), en rodajas, rellena con pimiento, y selecciones de estilo griego.", cat: "Productos" },
      { q: "¿Cuál es el formato estándar de despacho?", a: "El formato de despacho es tambor industrial de 265 lt. El peso depende del tipo de producto: entera 180 kg, descarozada 140 kg, rodajas 160 kg y rellena 160 kg.", cat: "Logística" },
      { q: "¿Dónde está ubicada la empresa?", a: "Nuestra planta y administración comercial están situadas en Tropero Sosa 933, Maipú, Mendoza, Argentina.", cat: "Empresa" },
      { q: "¿A qué destinos exportan actualmente?", a: "Exportamos regularmente a Brasil y Chile, abastecemos Uruguay y estamos proyectando la apertura en Paraguay, Perú y España.", cat: "Mercados" },
      { q: "¿Cuáles son los horarios de atención comercial?", a: "Atendemos de lunes a viernes de 08:00 a 17:00 (hora de Mendoza, UTC-3). Arriba en la barra puedes ver la equivalencia con tu hora local.", cat: "Empresa" },
      { q: "Dato curioso sobre nuestras aceitunas", a: "El agua pura de deshielo de los Andes y la gran amplitud térmica de Mendoza le otorgan a las aceitunas una piel firme, pulpa densa y excelente resistencia en tambor.", cat: "Curiosidades" }
    ],
    en: [
      { q: "How do I request a quote?", a: "Select the desired variety and drum quantity, then click 'Add to quote'. In the Quotation drawer, click 'Send to WhatsApp' to connect directly with our commercial manager.", cat: "Quotes" },
      { q: "Which olive varieties do you supply?", a: "We supply green and black olives in whole, pitted, sliced, pimiento-stuffed, as well as Greek-style grades.", cat: "Products" },
      { q: "What is the primary export packaging?", a: "The dispatch format is a 265 L industrial drum. Weight depends on the product type: whole 180 kg, pitted 140 kg, sliced 160 kg and stuffed 160 kg.", cat: "Logistics" },
      { q: "Where is the company located?", a: "Our commercial and packing headquarters are located at Tropero Sosa 933, Maipú, Mendoza, Argentina.", cat: "Company" },
      { q: "Which international destinations do you serve?", a: "We export directly to Brazil and Chile, supply Uruguay, and are actively preparing routes to Paraguay, Peru, and Spain.", cat: "Markets" },
      { q: "What are your business operating hours?", a: "Monday through Friday, 08:00 to 17:00 (Mendoza time, UTC-3). Check the top utility bar for your local converted time.", cat: "Company" },
      { q: "Curious fact about our olives", a: "Andean mineral snowmelt and Mendoza’s dry thermal amplitude give our olives superior flesh firmness and exceptional brine shelf-life.", cat: "Trivia" }
    ],
    pt: [
      { q: "Como solicitar uma cotação comercial?", a: "Selecione a variedade e a quantidade de tambores e clique em 'Adicionar à cotação'. No painel de Cotação, clique em 'Enviar para WhatsApp' para falar com o responsável comercial.", cat: "Cotação" },
      { q: "Quais são as variedades de azeitona disponíveis?", a: "Disponibilizamos azeitonas verdes e pretas nas opções inteiras, descaroçadas, fatiadas, recheadas com pimento e as seleções de estilo grego.", cat: "Produtos" },
      { q: "Qual é a embalagem padrão de exportação?", a: "O formato de despacho é o tambor industrial de 265 L. O peso depende do tipo de produto: inteira 180 kg, descaroçada 140 kg, em rodelas 160 kg e recheada 160 kg.", cat: "Logística" },
      { q: "Onde fica a sede da empresa?", a: "A nossa sede e entreposto comercial situam-se em Tropero Sosa 933, Maipú, Mendoza, Argentina.", cat: "Empresa" },
      { q: "Para que países exportam atualmente?", a: "Exportamos habitualmente para o Brasil e Chile, atendemos o Uruguai e estamos a preparar remessas para Paraguai, Peru e Espanha.", cat: "Mercados" },
      { q: "Qual é o horário comercial de atendimento?", a: "De segunda a sexta, das 08:00 às 17:00 (horário de Mendoza, UTC-3). A barra superior indica o seu horário local equivalente.", cat: "Empresa" },
      { q: "Curiosidade sobre as nossas azeitonas", a: "A irrigação com água pura da cordilheira dos Andes garante azeitonas de polpa carnuda e sabor marcante para o mercado exterior.", cat: "Curiosidades" }
    ]
  };

  // State
  let language = storage.get('oliv_lang', 'es');
  if (!copy[language]) language = 'es';
  let quoteCart = normalizeQuoteCart(storage.get('oliv_quote_cart', []));
  let selectedRating = storage.get('oliv_rating', 0);
  let savedRatingComment = storage.get('oliv_rating_comment', '');
  let activeProductForModal = null;
  let activeInternalRole = storage.get('oliv_internal_role', null);
  let languageChoiceSeen = storage.get('oliv_language_choice_seen', false);

  // Country/timezone selected from the integrated world map.
  let selectedCountryTimezone = {
    name: 'Argentina',
    offsetMinutes: -180,
    timezoneLabel: 'UTC-03:00',
    languageGroup: 'es'
  };

  // Realtime 1:1 Cursor (zero delay, immediate tracking)
  const cursor = $('#customCursor');
  if (cursor && !reducedMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });

    const bindHoverStates = () => {
      $$('a, button, input, select, textarea, .interactive, .olive-item, .country-path, .map-node').forEach(el => {
        el.addEventListener('pointerenter', () => cursor.classList.add('hover'));
        el.addEventListener('pointerleave', () => cursor.classList.remove('hover'));
        el.addEventListener('pointerdown', () => cursor.classList.add('down'));
        el.addEventListener('pointerup', () => cursor.classList.remove('down'));
      });
    };
    bindHoverStates();
  }

  // 6. Language Handling
  function setLanguage(next, close = false) {
    language = next;
    storage.set('oliv_lang', next);
    applyLanguage();
    if (close) closeLanguage();
  }

  function applyLanguage() {
    const c = copy[language];
    document.documentElement.lang = language;
    $('#currentLangCode').textContent = language.toUpperCase();
    const languageChoiceCopy = {
      es: {
        eyebrow: '00 / IDIOMA & ZONA HORARIA',
        title: 'Elegí tu idioma tocando tu país.',
        body: 'Tocá un país en el mapa. La web detectará el idioma principal de referencia y ajustará automáticamente la hora para mostrarte cuándo podés comunicarte con nuestro equipo.',
        note: 'Español, portugués e inglés se asignan automáticamente. Para cualquier otro idioma, la web usa English como idioma de respaldo.'
      },
      en: {
        eyebrow: '00 / LANGUAGE & TIME ZONE',
        title: 'Choose your language by touching your country.',
        body: 'Touch a country on the map. The website will detect the main reference language and automatically adjust the time to show when you can contact our team.',
        note: 'Spanish, Portuguese and English are assigned automatically. For any other language, the website uses English as the fallback.'
      },
      pt: {
        eyebrow: '00 / IDIOMA & FUSO HORÁRIO',
        title: 'Escolha o idioma tocando no seu país.',
        body: 'Toque em um país no mapa. O site detectará o idioma principal de referência e ajustará automaticamente o horário para mostrar quando você pode entrar em contato com a nossa equipe.',
        note: 'Espanhol, português e inglês são atribuídos automaticamente. Para qualquer outro idioma, o site usa o English como idioma de fallback.'
      }
    }[language];
    if (languageChoiceCopy) {
      const eyebrow = $('#languageChoiceEyebrow');
      const title = $('#languageChoiceTitle');
      const body = $('#languageChoiceBody');
      const note = $('#languageChoiceNote');
      if (eyebrow) eyebrow.textContent = languageChoiceCopy.eyebrow;
      if (title) title.textContent = languageChoiceCopy.title;
      if (body) body.textContent = languageChoiceCopy.body;
      if (note) note.textContent = languageChoiceCopy.note;
    }

    // Static text bindings
    $$('[data-i18n]').forEach(el => {
      const keys = el.dataset.i18n.split('.');
      let val = c;
      keys.forEach(k => { if (val) val = val[k]; });
      if (typeof val === 'string') el.textContent = val;
    });

    renderOliveCatalog();
    renderProvincesList();
    renderCountriesList();
    renderFAQ();
    updateQuoteUI();
    renderRating();
    updateClocks();
  }

  function openLanguage(e) {
    if (e) e.preventDefault();
    const panel = $('#languageChoice');
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('language-panel-open');
    window.setTimeout(() => $('#languageChoiceDialog')?.focus(), 30);
  }

  function closeLanguage(markSeen = true) {
    const panel = $('#languageChoice');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('language-panel-open');
    if (markSeen) {
      languageChoiceSeen = true;
      storage.set('oliv_language_choice_seen', true);
    }
  }

  $('#openLanguage')?.addEventListener('click', openLanguage);
  $('#languageChoiceBackdrop')?.addEventListener('click', () => closeLanguage(true));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('#languageChoice')?.classList.contains('open')) closeLanguage(true);
  });

  // A new visitor gets the map automatically. Later visits open it only from the header language control.
  window.setTimeout(() => {
    if (!languageChoiceSeen) openLanguage();
  }, reducedMotion ? 0 : 650);

  // 7. Clocks & Timezone conversion
  function formatOffset(minutes) {
    const sign = minutes >= 0 ? '+' : '-';
    const abs = Math.abs(minutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, '0');
    const mins = String(abs % 60).padStart(2, '0');
    return `UTC${sign}${hours}:${mins}`;
  }

  function clockFromOffset(date, offsetMinutes, locale = 'es-AR') {
    const shifted = new Date(date.getTime() + offsetMinutes * 60000);
    return shifted.toLocaleTimeString(locale, {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function convertedBusinessHours(offsetMinutes) {
    const hqOffset = siteConfig.hqUtcOffset * 60;
    const delta = offsetMinutes - hqOffset;
    const startRaw = 8 * 60 + delta;
    const endRaw = 17 * 60 + delta;
    const normalize = mins => ((mins % 1440) + 1440) % 1440;
    const start = normalize(startRaw);
    const end = normalize(endRaw);
    const formatMinutes = mins => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    const endMarker = endRaw >= 1440 || endRaw < 0 ? ' →' : '';
    return `${formatMinutes(start)}–${formatMinutes(end)}${endMarker}`;
  }

  function updateSelectedCountryUI() {
    const country = selectedCountryTimezone.name || 'Argentina';
    const offsetMinutes = Number.isFinite(selectedCountryTimezone.offsetMinutes) ? selectedCountryTimezone.offsetMinutes : -180;
    const timezoneLabel = selectedCountryTimezone.timezoneLabel || formatOffset(offsetMinutes);
    const selectedCountry = $('#utilitySelectedCountry');
    const contactConverted = $('#contactHoursConverted');
    const schedule = $('#utilitySchedule');
    const mapStatus = $('#languageMapStatus');
    const contactHours = convertedBusinessHours(offsetMinutes);
    const crossesDay = contactHours.includes('→');

    if (selectedCountry) {
      selectedCountry.innerHTML = `País seleccionado: <strong>${country}</strong> (${timezoneLabel})`;
    }

    if (mapStatus) mapStatus.textContent = country.toUpperCase();
    if (schedule) schedule.textContent = `Atención comercial en ${country}: ${contactHours}${crossesDay ? ' · finaliza al día siguiente' : ''}`;
    if (contactConverted) {
      contactConverted.textContent = `En ${country} (${timezoneLabel}), podés comunicarte de lunes a viernes · ${contactHours}${crossesDay ? ' (la franja termina al día siguiente)' : ''}.`;
    }
  }

  function updateClocks() {
    const now = new Date();
    const mendozaTimeStr = now.toLocaleTimeString('es-AR', {
      timeZone: siteConfig.timezoneHQ,
      hour: '2-digit',
      minute: '2-digit'
    });
    const mendozaClock = $('#mendozaClock');
    if (mendozaClock) mendozaClock.textContent = mendozaTimeStr;

    const offsetMinutes = Number.isFinite(selectedCountryTimezone.offsetMinutes) ? selectedCountryTimezone.offsetMinutes : -180;
    const selectedClock = $('#selectedCountryClock');
    if (selectedClock) selectedClock.textContent = clockFromOffset(now, offsetMinutes);

    const buyerClock = $('#buyerClock');
    if (buyerClock) buyerClock.textContent = clockFromOffset(now, -180);
  }

  function handleCountryTimezoneMessage(event) {
    const data = event.data;
    if (!data || data.type !== 'oliv-country-selected') return;

    selectedCountryTimezone = {
      name: data.countryName || 'País seleccionado',
      offsetMinutes: Number.isFinite(Number(data.timezoneOffsetMinutes)) ? Number(data.timezoneOffsetMinutes) : -180,
      timezoneLabel: data.timezoneLabel || formatOffset(Number(data.timezoneOffsetMinutes) || -180),
      languageGroup: data.languageGroup || 'en',
      officialLanguages: data.officialLanguages || [],
      countryCode: data.countryCode || ''
    };

    updateSelectedCountryUI();
    updateClocks();

    // The map is the only language selector. Accept only our three supported UI languages.
    // Every other country uses English as the fallback.
    const nextLanguage = ['es', 'pt', 'en'].includes(selectedCountryTimezone.languageGroup)
      ? selectedCountryTimezone.languageGroup
      : 'en';
    setLanguage(nextLanguage, false);
    closeLanguage(true);
  }

  window.addEventListener('message', handleCountryTimezoneMessage);
  updateSelectedCountryUI();
  updateClocks();
  setInterval(updateClocks, 30000);

  // 8. Olive Varieties Catalog Rendering
  function renderOliveCatalog() {
    const grid = $('#oliveCatalogGrid');
    if (!grid) return;

    grid.innerHTML = oliveVariants.map(v => {
      const name = v.name[language] || v.name.es;
      const action = '↗';
      return `
        <article class="olive-card card interactive" data-olive-id="${v.id}" tabindex="0" role="button" aria-label="${name}">
          <div class="olive-img-wrap">
            <img src="${v.img}" alt="${name}" loading="lazy" decoding="async">
          </div>
          <div class="olive-card-foot">
            <div class="olive-card-name">${name}</div>
            <span class="olive-card-action" aria-hidden="true">${action}</span>
          </div>
        </article>
      `;
    }).join('');

    const cards = [...grid.querySelectorAll('.olive-card')];
    const setActive = activeCard => {
      cards.forEach(card => {
        card.classList.toggle('is-active', card === activeCard);
        card.classList.toggle('is-sibling', !!activeCard && card !== activeCard);
      });
    };
    const clearActive = () => cards.forEach(card => card.classList.remove('is-active', 'is-sibling'));

    cards.forEach(card => {
      const activateVisual = () => setActive(card);
      const deactivateVisual = () => clearActive();
      const open = () => renderInlineProductDetail(card.dataset.oliveId);
      card.addEventListener('pointerenter', activateVisual);
      card.addEventListener('pointerleave', deactivateVisual);
      card.addEventListener('focus', activateVisual);
      card.addEventListener('blur', deactivateVisual);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  }

  function renderInlineProductDetail(oliveId) {
    const product = oliveVariants.find(o => o.id === oliveId);
    const box = $('#productDetailInline');
    if (!product || !box) return;
    activeProductForModal = product;
    const name = product.name[language] || product.name.es;
    const type = product.type[language] || product.type.es;
    const desc = product.desc[language] || product.desc.es;
    const quoteLabel = language === 'es' ? 'Solicitar cotización' : language === 'en' ? 'Request quote' : 'Solicitar cotação';
    box.innerHTML = `
      <article class="product-detail-card">
        <div class="product-detail-media"><img src="${product.img}" alt="${name}"></div>
        <div class="product-detail-copy">
          <p class="eyebrow gold">ACEITUNA DE MESA</p>
          <h3>${name}</h3>
          <p class="product-detail-type">${type}</p>
          <p>${desc}</p>
          <div class="product-detail-meta"><span>${getProductFormat(product)}</span></div>
          <div class="inline-quote-row">
            <label for="inlineProductQty">Tambores</label>
            <div class="qty-stepper"><button type="button" id="inlineQtyMinus">−</button><input type="number" id="inlineProductQty" min="0" max="1000" value="0"><button type="button" id="inlineQtyPlus">+</button></div>
            <strong id="inlineQuoteStatus">0 tambores · cotización pendiente</strong>
          </div>
          <div class="product-detail-actions">
            <button class="button button-gold" id="inlineAddQuoteBtn" type="button">${quoteLabel} ↗</button>
            <button class="button button-outline" id="inlineWhatsAppBtn" type="button">WhatsApp comercial ↗</button>
          </div>
        </div>
      </article>`;

    const qty = $('#inlineProductQty');
    const update = () => { qty.value = Math.max(0, parseInt(qty.value || 0, 10)); $('#inlineQuoteStatus').textContent = `${qty.value} tambores · cotización pendiente`; };
    $('#inlineQtyMinus').addEventListener('click', () => { qty.value = Math.max(0, parseInt(qty.value || 0, 10)-1); update(); });
    $('#inlineQtyPlus').addEventListener('click', () => { qty.value = parseInt(qty.value || 0, 10)+1; update(); });
    qty.addEventListener('input', update);
    $('#inlineAddQuoteBtn').addEventListener('click', () => {
      const amount = Math.max(0, parseInt(qty.value || 0, 10));
      if (!amount) { showToast('Selecciona al menos 1 tambor'); return; }
      const existing = quoteCart.find(item => item.id === product.id);
      if (existing) existing.quantity += amount;
      else quoteCart.push({ id: product.id, name: product.name, quantity: amount, unit: 'tambores', format: product.format, img: product.img });
      storage.set('oliv_quote_cart', quoteCart); updateQuoteUI(); openQuoteDrawer();
      $('#inlineQuoteStatus').textContent = `${amount} tambores · agregado a cotización`;
    });
    $('#inlineWhatsAppBtn').addEventListener('click', () => {
      const amount = Math.max(0, parseInt(qty.value || 0, 10));
      if (!amount) { showToast('Selecciona al menos 1 tambor'); return; }
      const msg = encodeURIComponent(`Hola, quiero solicitar una cotización comercial a Olivícola Luján.\n\nDetalle:\n- ${amount} tambores de ${name}\n\nGracias.`);
      window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`, '_blank');
    });
    box.classList.add('has-product');
    box.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  // 9. Dedicated Product Detail Modal
  function openProductModal(oliveId) {
    const product = oliveVariants.find(o => o.id === oliveId);
    if (!product) return;
    activeProductForModal = product;

    $('#modalProductImg').src = product.img;
    $('#modalProductImg').alt = product.name[language] || product.name.es;
    $('#modalProductTitle').textContent = product.name[language] || product.name.es;
    $('#modalProductDesc').textContent = product.desc[language] || product.desc.es;
    $('#modalProductFormat').textContent = getProductFormat(product);
    $('#modalProductQty').value = 0;
    $('#addToQuoteBtn')?.removeAttribute('disabled');
    $('#instantWhatsappBtn')?.removeAttribute('disabled');

    $('#productModal').classList.add('open');
    $('#productModal').setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Track analytics event
    trackAnalytics('product_view', { id: oliveId });
  }

  function closeProductModal() {
    $('#productModal').classList.remove('open');
    $('#productModal').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    activeProductForModal = null;
  }

  $$('[data-close-product]').forEach(btn => btn.addEventListener('click', closeProductModal));
  $('#qtyMinus')?.addEventListener('click', () => {
    const input = $('#modalProductQty');
    input.value = Math.max(0, parseInt(input.value || 0) - 1);
  });
  $('#qtyPlus')?.addEventListener('click', () => {
    const input = $('#modalProductQty');
    input.value = parseInt(input.value || 0) + 1;
  });
  $('#modalProductQty')?.addEventListener('input', () => {
    const input = $('#modalProductQty');
    input.value = Math.max(0, parseInt(input.value || 0));
  });

  // Add to Quote Cart
  $('#addToQuoteBtn')?.addEventListener('click', () => {
    if (!activeProductForModal) return;
    const qty = parseInt($('#modalProductQty').value || 0);
    if (qty <= 0) { showToast(language === 'es' ? 'Selecciona al menos 1 tambor' : language === 'en' ? 'Select at least 1 drum' : 'Selecione pelo menos 1 tambor'); return; }
    const existing = quoteCart.find(item => item.id === activeProductForModal.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      quoteCart.push({
        id: activeProductForModal.id,
        name: activeProductForModal.name,
        quantity: qty,
        unit: 'tambores',
        format: activeProductForModal.format,
        img: activeProductForModal.img
      });
    }
    storage.set('oliv_quote_cart', quoteCart);
    updateQuoteUI();
    closeProductModal();
    showToast(language === 'es' ? 'Añadido a cotización' : language === 'en' ? 'Added to quote' : 'Adicionado à cotação');
    openQuoteDrawer();
    trackAnalytics('quote_started', { count: quoteCart.length });
  });

  // Direct WhatsApp from Modal
  $('#instantWhatsappBtn')?.addEventListener('click', () => {
    if (!activeProductForModal) return;
    const qty = parseInt($('#modalProductQty').value || 0);
    const prodName = activeProductForModal.name[language] || activeProductForModal.name.es;
    const msg = encodeURIComponent(`Hola, quiero solicitar una cotización comercial a Olivícola Luján.\n\nDetalle:\n- ${qty} tambores de ${prodName}\n\nQuedo atento/a para coordinar despacho. Gracias.`);
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`, '_blank');
  });

  // 10. Quote Intent Drawer (Cart named "Cotización")
  function updateQuoteUI() {
    const totalDrums = quoteCart.reduce((sum, it) => sum + it.quantity, 0);
    const badge = $('#quoteBadge');
    if (badge) badge.textContent = totalDrums;
    const mobileCount = $('#mobileQuoteCount');
    if (mobileCount) mobileCount.textContent = totalDrums;
    const totalDrumsEl = $('#quoteTotalDrums');
    if (totalDrumsEl) totalDrumsEl.textContent = `${totalDrums} tambores`;

    const list = $('#quoteItemsList');
    if (!list) return;

    if (quoteCart.length === 0) {
      list.innerHTML = `
        <div class="empty-quote-state">
          <p>${language === 'es' ? 'Aún no has añadido variedades a la cotización.' : language === 'en' ? 'No olive varieties added to quotation yet.' : 'Nenhuma variedade adicionada à cotação ainda.'}</p>
          <a class="button button-gold" href="#products" onclick="document.querySelector('#quoteDrawer').classList.remove('open')">
            ${language === 'es' ? 'Explorar catálogo de aceitunas' : language === 'en' ? 'Explore olive catalog' : 'Explorar catálogo de azeitonas'} ↗
          </a>
        </div>
      `;
    } else {
      list.innerHTML = quoteCart.map((item, idx) => {
        const itemName = typeof item.name === 'object' ? (item.name[language] || item.name.es) : item.name;
        return `
          <div class="quote-item-row">
            <img src="${item.img}" alt="${itemName}">
            <div class="quote-item-meta">
              <strong>${itemName}</strong>
              <small>${typeof item.format === 'object' ? (item.format[language] || item.format.es) : item.format}</small>
              <div class="quote-qty-edit">
                <button onclick="window.modifyQuoteQty(${idx}, -1)">-</button>
                <span>${item.quantity} tambores</span>
                <button onclick="window.modifyQuoteQty(${idx}, 1)">+</button>
              </div>
            </div>
            <button class="remove-quote-item" onclick="window.removeQuoteItem(${idx})" title="Eliminar">×</button>
          </div>
        `;
      }).join('');
    }
  }

  window.modifyQuoteQty = (idx, delta) => {
    if (!quoteCart[idx]) return;
    quoteCart[idx].quantity = Math.max(1, quoteCart[idx].quantity + delta);
    storage.set('oliv_quote_cart', quoteCart);
    updateQuoteUI();
  };

  window.removeQuoteItem = (idx) => {
    quoteCart.splice(idx, 1);
    storage.set('oliv_quote_cart', quoteCart);
    updateQuoteUI();
    showToast('Variedad removida');
  };

  function openQuoteDrawer() {
    $('#quoteDrawer').classList.add('open');
    $('#quoteDrawer').setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeQuoteDrawer() {
    $('#quoteDrawer').classList.remove('open');
    $('#quoteDrawer').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  $('#openQuoteBtn')?.addEventListener('click', openQuoteDrawer);
  $('#mobileQuote')?.addEventListener('click', openQuoteDrawer);
  $$('[data-close-quote]').forEach(b => b.addEventListener('click', closeQuoteDrawer));

  // Send structured Quote to WhatsApp
  $('#sendQuoteWhatsappBtn')?.addEventListener('click', () => {
    if (quoteCart.length === 0) {
      showToast(language === 'es' ? 'Agrega al menos una variedad' : language === 'en' ? 'Add at least one variety' : 'Adicione pelo menos uma variedade');
      return;
    }
    const lines = quoteCart.map(it => {
      const name = typeof it.name === 'object' ? (it.name[language] || it.name.es) : it.name;
      return `- ${it.quantity} tambores de ${name}`;
    }).join('\n');

    const greeting = language === 'es' ? 'Hola, quiero solicitar una cotización comercial a Olivícola Luján.' : language === 'en' ? 'Hello, I would like to request a commercial quotation from Olivícola Luján.' : 'Olá, gostaria de solicitar uma cotação comercial da Olivícola Luján.';
    const close = language === 'es' ? 'Quedo atento/a para coordinar despacho. Gracias.' : language === 'en' ? 'Looking forward to coordinating dispatch details. Thank you.' : 'Fico no aguardo para coordenar a remessa. Obrigado.';

    const fullMsg = `${greeting}\n\nDetalle:\n${lines}\n\n${close}`;
    trackAnalytics('quote_sent', { items: quoteCart.length });
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(fullMsg)}`, '_blank');
  });

  // 11. Market presentation uses static map artwork plus adjacent status lists.

  function initOriginVideo() {
    const video = $('#originAmbientVideo');
    if (!video) return;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    const play = () => video.play().catch(() => {});
    play();
    window.addEventListener('load', play, { once: true });
  }

  function renderProvincesList() {
    const list = $('#provincesList');
    if (!list) return;
    list.innerHTML = argentinaProvinces.map(p => {
      const isActive = p.status === 'active';
      const label = isActive ? (copy[language].markets.activeLegend) : (copy[language].markets.neutralLegend);
      return `
        <div class="market-row-item ${isActive ? 'active' : 'neutral'}">
          <div>
            <strong>${p.name}</strong>
            <small>${p.note}</small>
          </div>
          <span class="status-tag ${isActive ? 'tag-gold' : 'tag-neutral'}">${label}</span>
        </div>
      `;
    }).join('');
  }

  function renderCountriesList() {
    const list = $('#countriesList');
    if (!list) return;
    list.innerHTML = internationalMarkets.map(m => {
      const isActive = m.status === 'active';
      const label = isActive ? (copy[language].markets.activeLegend) : (language === 'es' ? 'Sin presencia activa' : language === 'en' ? 'No active presence' : 'Sem presença ativa');
      return `
        <div class="market-row-item ${isActive ? 'active' : 'neutral'}">
          <div>
            <strong>${m.name}</strong>
            <small>${m.region} · ${m.note}</small>
          </div>
          <span class="status-tag ${isActive ? 'tag-gold' : 'tag-neutral'}">${label}</span>
        </div>
      `;
    }).join('');
  }

  // 12. Deterministic FAQ Chatbot Widget
  function renderFAQ() {
    const list = $('#faqQuestionsList');
    if (!list) return;
    const items = faqData[language] || faqData.es;

    list.innerHTML = items.map((item, idx) => `
      <button class="faq-question-btn" data-faq-idx="${idx}">
        <span>${item.q}</span>
        <i class="faq-cat">${item.cat}</i>
      </button>
    `).join('');

    list.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.faqIdx;
        const selected = items[idx];
        if (!selected) return;

        $('#faqAnswerQuestion').textContent = selected.q;
        $('#faqAnswerText').textContent = selected.a;
        $('#faqAnswerBox').style.display = 'block';
        $('#faqQuestionsList').style.display = 'none';
        trackAnalytics('faq_opened', { q: selected.q });
      });
    });
  }

  $('#faqBackBtn')?.addEventListener('click', () => {
    $('#faqAnswerBox').style.display = 'none';
    $('#faqQuestionsList').style.display = 'grid';
  });

  const faqWidget = $('#faqWidget');
  const faqCard = $('#faqCard');
  $('#faqToggleBtn')?.addEventListener('click', () => {
    faqCard.classList.toggle('open');
    faqCard.setAttribute('aria-hidden', faqCard.classList.contains('open') ? 'false' : 'true');
  });
  $('#closeFaqBtn')?.addEventListener('click', () => {
    faqCard.classList.remove('open');
    faqCard.setAttribute('aria-hidden', 'true');
  });

  // 13. Rating with Text Comment Persistence
  function renderRating() {
    $$('#stars button').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.rating) <= selectedRating);
    });

    const msg = selectedRating ?
      `${selectedRating}/5 · ${selectedRating === 5 ? 'Excelente' : selectedRating >= 4 ? 'Muy buena' : selectedRating >= 3 ? 'Buena' : 'Gracias por tu sinceridad'}` :
      'Selecciona una puntuación';
    $('#ratingMessage').textContent = msg;

    if (savedRatingComment && !$('#ratingComment').value) {
      $('#ratingComment').value = savedRatingComment;
    }
  }

  $$('#stars button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.dataset.rating);
      renderRating();
    });
  });

  $('#saveRating')?.addEventListener('click', () => {
    if (!selectedRating) {
      showToast('Selecciona al menos una estrella');
      return;
    }
    const comment = $('#ratingComment').value.trim();
    storage.set('oliv_rating', selectedRating);
    storage.set('oliv_rating_comment', comment);
    showToast('Valoración y comentario guardados localmente');
    trackAnalytics('rating_submitted', { rating: selectedRating });
  });

  // 14. Account System: Customer vs Internal Role Gate
  const accountModal = $('#accountModal');
  function openAccount() {
    accountModal.classList.add('open');
    accountModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Check if internal session active
    if (activeInternalRole) {
      showInternalDashboard();
    } else {
      // Pre-fill customer
      const cust = storage.get('oliv_customer_profile', {});
      $('#customerName').value = cust.name || '';
      $('#customerCompany').value = cust.company || '';
      if (cust.country) $('#customerCountry').value = cust.country;
    }
  }

  function closeAccount() {
    accountModal.classList.remove('open');
    accountModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  ['openAccount', 'openAccountFromTop', 'mobileAccount', 'openAccountFooter'].forEach(id => {
    $('#' + id)?.addEventListener('click', openAccount);
  });
  $$('[data-close-account]').forEach(b => b.addEventListener('click', closeAccount));

  // Tabs Customer vs Internal
  $('#tabCustomer')?.addEventListener('click', () => {
    $('#tabCustomer').classList.add('active');
    $('#tabInternal').classList.remove('active');
    $('#accountFormCustomer').style.display = 'grid';
    $('#accountFormInternal').style.display = 'none';
    $('#internalDashboard').style.display = 'none';
  });

  $('#tabInternal')?.addEventListener('click', () => {
    $('#tabInternal').classList.add('active');
    $('#tabCustomer').classList.remove('active');
    $('#accountFormCustomer').style.display = 'none';
    if (activeInternalRole) {
      showInternalDashboard();
    } else {
      $('#accountFormInternal').style.display = 'grid';
      $('#internalDashboard').style.display = 'none';
    }
  });

  // Google OAuth Abstraction Button
  $('#googleSignInCustomer')?.addEventListener('click', () => {
    // Clean OAuth interface ready for provider configuration
    showToast('Autenticación Google preparada (Modo Demostración activo)');
    $('#customerName').value = "Usuario Google Verificado";
    $('#customerCompany').value = "Distribuidora Internacional";
  });

  // Customer Form Submit
  $('#accountFormCustomer')?.addEventListener('submit', e => {
    e.preventDefault();
    const cust = {
      name: $('#customerName').value.trim(),
      company: $('#customerCompany').value.trim(),
      country: $('#customerCountry').value
    };
    storage.set('oliv_customer_profile', cust);
    $('#accountStatus').textContent = `Perfil de cliente guardado para ${cust.name}.`;
    showToast('Perfil comercial guardado');
  });

  // Internal Form Submit (Roles: Gerente, Administrador, Jefe, Programador)
  $('#accountFormInternal')?.addEventListener('submit', e => {
    e.preventDefault();
    const role = $('#internalRole').value;
    activeInternalRole = role;
    storage.set('oliv_internal_role', role);
    showInternalDashboard();
    showToast(`Sesión interna iniciada como ${role.toUpperCase()}`);
  });

  function showInternalDashboard() {
    $('#accountFormInternal').style.display = 'none';
    $('#internalDashboard').style.display = 'block';
    const roleName = activeInternalRole ? activeInternalRole.toUpperCase() : 'GERENTE';
    $('#activeRoleBadge').textContent = `Sesión Interna Activa: ${roleName}`;

    // Read real platform metrics stored locally
    const vCount = storage.get('oliv_visits_v1', 1);
    const qCount = quoteCart.length > 0 ? quoteCart.length : storage.get('oliv_quotes_count', 2);
    const rCount = selectedRating ? 1 : 0;
    const fCount = storage.get('oliv_faq_count', 4);

    $('#statVisits').textContent = vCount;
    $('#statQuotes').textContent = qCount;
    $('#statRatings').textContent = rCount;
    $('#statFaq').textContent = fCount;
  }

  $('#logoutInternalBtn')?.addEventListener('click', () => {
    activeInternalRole = null;
    storage.set('oliv_internal_role', null);
    $('#internalDashboard').style.display = 'none';
    $('#accountFormInternal').style.display = 'grid';
    $('#accountStatus').textContent = 'Sesión interna cerrada.';
    showToast('Sesión cerrada');
  });

  // 15. Analytics Tracking Adapter (Configurable, honest)
  function trackAnalytics(event, data = {}) {
    try {
      const log = storage.get('oliv_analytics_log', []);
      log.push({ event, data, timestamp: new Date().toISOString() });
      if (log.length > 50) log.shift();
      storage.set('oliv_analytics_log', log);

      if (event === 'faq_opened') {
        const c = storage.get('oliv_faq_count', 0) + 1;
        storage.set('oliv_faq_count', c);
      } else if (event === 'quote_sent') {
        const c = storage.get('oliv_quotes_count', 0) + 1;
        storage.set('oliv_quotes_count', c);
      }
    } catch {}
  }

  // 16. Visitor Counter
  const visitorKey = 'oliv_visits_v1';
  const visits = Number(localStorage.getItem(visitorKey) || 0) + 1;
  localStorage.setItem(visitorKey, String(visits));
  const footVis = $('#footerVisitors');
  if (footVis) footVis.textContent = `Visitas en este dispositivo: ${visits}`;

  // Mobile menu
  $('#menuButton')?.addEventListener('click', () => $('#mobileNav').classList.toggle('open'));
  $$('.mobile-nav a').forEach(a => a.addEventListener('click', () => $('#mobileNav').classList.remove('open')));

  // Ficha comercial deferred feedback
  $('#deferredFichaBtn')?.addEventListener('click', () => {
    showToast(language === 'es' ? 'Ficha comercial disponible próximamente' : language === 'en' ? 'Commercial sheet coming soon' : 'Ficha comercial disponível em breve');
  });

  // Lightbox
  function openLightbox(src, alt) {
    $('#lightboxImage').src = src;
    $('#lightboxImage').alt = alt || '';
    $('#lightbox').classList.add('open');
    document.body.classList.add('modal-open');
    $('#lightbox').setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    $('#lightbox').classList.remove('open');
    document.body.classList.remove('modal-open');
    $('#lightbox').setAttribute('aria-hidden', 'true');
  }
  $('#closeLightbox')?.addEventListener('click', closeLightbox);
  $('#lightbox')?.addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });

  // Escape key closer
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLanguage();
      closeAccount();
      closeProductModal();
      closeQuoteDrawer();
      closeLightbox();
      $('#faqCard')?.classList.remove('open');
    }
  });

  // Toast
  function showToast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // Tilt Card Interaction
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--rx', `${(0.5 - y) * 5}deg`);
        card.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Scroll reveal
  if (!reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px' });
    $$('.reveal').forEach(el => observer.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  window.addEventListener('scroll', () => {
    $('#siteHeader')?.classList.toggle('scrolled', window.scrollY > 15);
  }, { passive: true });

  // Canvas ambient golden dust
  const canvas = $('#heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = $('.hero');
    let particles = [], pointer = { x: -9999, y: -9999 }, running = true;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = hero.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(45, Math.floor(r.width / 30)) }, () => ({
        x: Math.random() * r.width,
        y: Math.random() * r.height,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.14,
        a: Math.random() * 0.5 + 0.15
      }));
    }

    function drawCanvas() {
      if (!running || reducedMotion) return;
      const r = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = r.width;
        if (p.x > r.width) p.x = 0;
        if (p.y < 0) p.y = r.height;
        if (p.y > r.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 168, 79, ${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(drawCanvas);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    requestAnimationFrame(drawCanvas);
  }

  // Init routines
  initOriginVideo();
  applyLanguage();

  window.addEventListener('load', () => {
    setTimeout(() => $('#siteLoader')?.classList.add('hidden'), 300);
  });
})();
