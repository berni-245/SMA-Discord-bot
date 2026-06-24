// ============================================================
// SMA Discord Bot — Generador de presentación (pptxgenjs)
// Estilo: Discord oscuro + blurple
// ============================================================
'use strict';
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const DIAGRAMS = path.join(__dirname, 'diagrams');

// ─── PALETA ──────────────────────────────────────────────────
const C = {
  bgDark:   '1E1F22',  // portada / cierre
  bgMain:   '313338',  // contenido
  bgCard:   '2B2D31',  // tarjetas
  bgDeep:   '23272A',  // crisis slide
  blurple:  '5865F2',  // acento primario
  white:    'FFFFFF',
  muted:    'B5BAC1',
  dim:      '72767D',
  green:    '57F287',  // normal / guided OK
  red:      'ED4245',  // crisis / refuse_solution
  yellow:   'FEE75C',  // guided_only / warning
  pink:     'EB459E',  // A4 / acento secundario
  gold:     'FAA61A',  // A6
  teal:     '00B0F4',  // A5
  accent2:  '43B581',  // éxito alt
  strip:    '383A40',  // franja infraestructura
};

const AGENT = {
  A1: { id:'A1', name:'Frontier / Coordinador', color: C.blurple,  short:'Entrada · clasifica · deriva · ensambla · reconduce' },
  A2: { id:'A2', name:'Tutor',                  color: C.green,    short:'Teoría · práctica · código · quiz · orientación' },
  A3: { id:'A3', name:'Admin',                  color: C.yellow,   short:'Fechas · reglas publicadas · derivación' },
  A4: { id:'A4', name:'Follow-up',              color: C.pink,     short:'Seguimiento proactivo por DM (2–5 días post-sesión)' },
  A5: { id:'A5', name:'Feedback',               color: C.teal,     short:'Feedback voluntario · moderación · digest docente' },
  A6: { id:'A6', name:'Knowledge Curator',      color: C.gold,     short:'Ingesta docente versionada → KB / Config' },
};

const FONT = { h: 'Trebuchet MS', b: 'Calibri', c: 'Consolas' };

// ─── HELPERS ─────────────────────────────────────────────────
let pres;

function mkShadow() {
  return { type:'outer', blur:6, offset:2, angle:135, color:'000000', opacity:0.18 };
}

function slide(bg) {
  const s = pres.addSlide();
  s.background = { color: bg || C.bgMain };
  return s;
}

function title(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.5, y: opts.y ?? 0.22, w: opts.w ?? 9, h: opts.h ?? 0.6,
    fontSize: opts.fs ?? 36, bold: true, fontFace: FONT.h,
    color: opts.color ?? C.white, align: opts.align ?? 'left',
    margin: 0,
  });
}

function subtitle(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.5, y: opts.y ?? 0.85, w: opts.w ?? 9, h: opts.h ?? 0.35,
    fontSize: opts.fs ?? 15, fontFace: FONT.b, color: opts.color ?? C.muted,
    align: opts.align ?? 'left', margin: 0,
  });
}

function card(s, x, y, w, h, hdText, lines, accent, bg) {
  accent = accent || C.blurple;
  bg = bg || C.bgCard;
  // Card body
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{ color:bg }, shadow: mkShadow(), line:{ color:bg, pt:0 } });
  // Accent bar left
  s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.07, h, fill:{ color:accent } });
  // Header text
  if (hdText) {
    s.addText(hdText, {
      x: x+0.15, y: y+0.1, w: w-0.2, h: 0.32,
      fontSize: 11.5, bold: true, fontFace: FONT.b, color: accent, margin: 0,
    });
  }
  // Body lines
  if (lines && lines.length) {
    const lineObjs = lines.map((l, i) => ({
      text: l,
      options: { bullet: true, breakLine: i < lines.length-1, fontSize: 11.5, color: C.white, fontFace: FONT.b },
    }));
    s.addText(lineObjs, {
      x: x+0.15, y: y+(hdText ? 0.45 : 0.1), w: w-0.2, h: h-(hdText ? 0.52 : 0.18),
      fontFace: FONT.b, fontSize: 11.5, color: C.white,
    });
  }
}

function pill(s, x, y, text, bg, fg) {
  const w = Math.max(text.length * 0.085 + 0.3, 0.9);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h:0.3, fill:{ color: bg || C.blurple }, rectRadius:0.05 });
  s.addText(text, { x, y, w, h:0.3, fontSize:11, bold:true, fontFace:FONT.b, color:fg||C.white, align:'center', margin:0 });
  return w;
}

function circle(s, x, y, r, label, color, labelColor) {
  s.addShape(pres.shapes.OVAL, { x, y, w:r*2, h:r*2, fill:{ color: color||C.blurple } });
  s.addText(label, {
    x, y, w:r*2, h:r*2,
    fontSize: r < 0.4 ? 11 : (r < 0.55 ? 18 : 24),
    bold:true, fontFace:FONT.h, color:labelColor||C.white,
    align:'center', valign:'middle', margin:0,
  });
}

function diagram(s, x, y, w, h, sid) {
  const p = path.join(DIAGRAMS, `escenario-${sid}.png`);
  if (fs.existsSync(p)) {
    s.addImage({ path:p, x, y, w, h, sizing:{ type:'contain', w, h } });
  } else {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{ color:C.bgCard }, line:{ color:C.blurple, pt:2 } });
    s.addText(`[ Diagrama de secuencia — Escenario ${sid} ]`, {
      x, y:y+h/2-0.25, w, h:0.5, align:'center', fontSize:15, color:C.blurple, bold:true, fontFace:FONT.b,
    });
  }
}

function sectionBar(s, text, color) {
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.18, fill:{ color:color||C.blurple } });
  s.addText(text, { x:0.5, y:0, w:9, h:0.18, fontSize:10, bold:true, fontFace:FONT.b, color:C.white, margin:0 });
}

// ─── SLIDE 01 — PORTADA ──────────────────────────────────────
function s01() {
  const s = slide(C.bgDark);
  // Decorative circles
  s.addShape(pres.shapes.OVAL, { x:6.8, y:-0.8, w:4, h:4, fill:{ color:C.blurple, transparency:82 } });
  s.addShape(pres.shapes.OVAL, { x:8.2, y:2.5, w:2.5, h:2.5, fill:{ color:C.blurple, transparency:88 } });
  s.addShape(pres.shapes.OVAL, { x:-0.5, y:3.5, w:2.2, h:2.2, fill:{ color:C.blurple, transparency:88 } });
  // Bot icon placeholder circle
  circle(s, 0.5, 1.2, 0.55, '🤖', C.blurple, C.white);
  // Title
  s.addText('SMA de soporte a la cursada\nen Discord', {
    x:0.5, y:1.9, w:8.5, h:1.4,
    fontSize:44, bold:true, fontFace:FONT.h, color:C.white,
    align:'left', valign:'top',
  });
  s.addText('Diseño conceptual multiagente', {
    x:0.5, y:3.4, w:7, h:0.45,
    fontSize:20, fontFace:FONT.b, color:C.blurple, bold:true, align:'left',
  });
  s.addText('Sistemas Multiagente — ITBA   |   2026', {
    x:0.5, y:4.9, w:7, h:0.35,
    fontSize:13, fontFace:FONT.b, color:C.muted, align:'left',
  });
}

// ─── SLIDE 02 — AGENDA ───────────────────────────────────────
function s02() {
  const s = slide();
  title(s, 'Agenda');
  const items = [
    ['01', 'Problema y contexto', C.muted],
    ['02', 'Discord como ambiente', C.muted],
    ['03', 'Tesis de arquitectura', C.muted],
    ['04', 'Agentes A1–A6 (fichas)', C.muted],
    ['05', 'Infraestructura + Coordinación', C.muted],
    ['06', 'Multi-materia + Memoria', C.muted],
    ['07', 'Escenarios A · B · C · G', C.muted],
    ['08', 'Riesgos y Autoevaluación', C.muted],
  ];
  const cols = [0.5, 5.0];
  const half = Math.ceil(items.length / 2);
  items.forEach((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = cols[col];
    const y = 1.1 + row * 0.72;
    circle(s, x, y, 0.25, item[0], C.blurple, C.white);
    s.addText(item[1], { x:x+0.62, y:y+0.02, w:3.8, h:0.44, fontSize:16, fontFace:FONT.b, color:C.white, valign:'middle' });
  });
}

// ─── SLIDE 03 — PROBLEMA Y CONTEXTO ─────────────────────────
function s03() {
  const s = slide();
  title(s, 'Problema y contexto');
  const bullets = [
    'Discord es el canal de comunicación de cada cursada',
    'Hoy: mensajes y respuestas 100 % manuales',
    'Estudiantes y docentes con roles asignados (pre-autorizados)',
    'Necesidad: asistente inteligente que apoye sin reemplazar al docente',
    'Requisito: múltiples materias en paralelo, cada una aislada',
  ];
  bullets.forEach((b, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.1+i*0.72, w:0.05, h:0.45, fill:{ color:C.blurple } });
    s.addText(b, { x:0.72, y:1.05+i*0.72, w:5.5, h:0.55, fontSize:15, fontFace:FONT.b, color:C.white, valign:'middle' });
  });
  // Right: Discord-style "channels" decoration
  const chans = ['#consultas-alumnos','#material-catedra','#alertas-bienestar','DM  estudiante-bot'];
  const chanColors = [C.blurple, C.green, C.red, C.teal];
  s.addText('Canales Discord', { x:6.7, y:1.0, w:2.8, h:0.35, fontSize:13, bold:true, fontFace:FONT.b, color:C.muted });
  chans.forEach((ch, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:6.7, y:1.45+i*0.68, w:2.8, h:0.48, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x:6.7, y:1.45+i*0.68, w:0.06, h:0.48, fill:{ color:chanColors[i] } });
    s.addText(ch, { x:6.85, y:1.45+i*0.68, w:2.55, h:0.48, fontSize:13, fontFace:FONT.c, color:C.white, valign:'middle' });
  });
}

// ─── SLIDE 04 — DISCORD COMO AMBIENTE ────────────────────────
function s04() {
  const s = slide();
  title(s, 'Discord como ambiente');
  subtitle(s, 'El entorno condiciona qué puede percibirse y qué puede publicarse — no es solo una UI');

  // Flow: Gateway → Agentes → Dispatcher → Discord
  const boxes = [
    { x:0.5,  label:'Discord\nGateway', sub:'Sensor conceptual\nMenciones · comandos · DMs', color:C.blurple },
    { x:3.3,  label:'6 Agentes\nlógicos',  sub:'A1 · A2 · A3 · A4 · A5 · A6',               color:C.blurple },
    { x:6.1,  label:'Outbound\nDispatcher',sub:'Único actuador\nEscribe en Discord',          color:C.blurple },
  ];
  boxes.forEach((b, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:b.x, y:1.3, w:2.5, h:1.6, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x:b.x, y:1.3, w:0.07, h:1.6, fill:{ color:b.color } });
    s.addText(b.label, { x:b.x+0.15, y:1.35, w:2.2, h:0.55, fontSize:15, bold:true, fontFace:FONT.h, color:C.white });
    s.addText(b.sub,   { x:b.x+0.15, y:1.92, w:2.2, h:0.8,  fontSize:12, fontFace:FONT.b, color:C.muted });
    if (i < 2) {
      s.addShape(pres.shapes.RECTANGLE, { x:b.x+2.5, y:2.05, w:0.8, h:0.05, fill:{ color:C.muted } });
      s.addText('▶', { x:b.x+3.1, y:1.93, w:0.3, h:0.3, fontSize:16, color:C.muted, align:'center' });
    }
  });
  // Roles + Permissions note
  const notes = [
    { t:'Roles Discord', s:'estudiante / docente / ayudante — pre-autorizados', c:C.green },
    { t:'Permisos por canal', s:'VIEW_CHANNEL · SEND_MESSAGES · crear hilos (crisis)', c:C.yellow },
    { t:'Visibilidad', s:'canal público = público   |   DM = privado 1:1', c:C.teal },
  ];
  notes.forEach((n, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5+i*3.1, y:3.2, w:2.9, h:0.95, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addText(n.t, { x:0.65+i*3.1, y:3.26, w:2.6, h:0.3, fontSize:12, bold:true, fontFace:FONT.b, color:n.c });
    s.addText(n.s, { x:0.65+i*3.1, y:3.57, w:2.6, h:0.5, fontSize:11, fontFace:FONT.b, color:C.muted });
  });
  subtitle(s, 'Regla: canal público = público · DM = privado · no hay excepciones salvo transferencia consentida o crisis', { y:4.35, fs:12, color:C.dim });
}

// ─── SLIDE 05 — GLOSARIO CLAVE ───────────────────────────────
function s05() {
  const s = slide();
  title(s, 'Glosario clave');
  const defs = [
    { t:'Sesión',         d:'Intervalo de uso continuo. Cierra por inactividad (30–60 min config.) o cierre de jornada. Puede contener varias conversaciones.', c:C.blurple },
    { t:'Conversación',   d:'Secuencia coherente de turnos alrededor de una intención, dentro de un canal o hilo.', c:C.blurple },
    { t:'STM',            d:'Memoria intra-sesión (volátil). Coordina el intercambio actual. Se descarta al cerrar la sesión.', c:C.green },
    { t:'LTM',            d:'Persistencia entre sesiones. Hechos pedagógicos mínimos. Vida: cursada + 6 meses.', c:C.green },
    { t:'Visibilidad',    d:'público = canal / hilo legible por más de uno. dm = interacción privada 1:1 estudiante-bot.', c:C.teal },
    { t:'assistance_mode',d:'normal · guided_only · refuse_solution — decisión de OutputPolicy para cada respuesta práctica.', c:C.yellow },
  ];
  const cols = [0.5, 5.0];
  defs.forEach((d, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i-3;
    const x = cols[col], y = 1.1 + row * 1.4;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.3, h:1.25, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.07, h:1.25, fill:{ color:d.c } });
    s.addText(d.t, { x:x+0.15, y:y+0.08, w:4.0, h:0.3, fontSize:13, bold:true, fontFace:FONT.b, color:d.c });
    s.addText(d.d, { x:x+0.15, y:y+0.38, w:4.0, h:0.82, fontSize:11.5, fontFace:FONT.b, color:C.white });
  });
}

// ─── SLIDE 06 — TESIS DE ARQUITECTURA ───────────────────────
function s06() {
  const s = slide(C.bgCard);
  s.addText('Tesis de arquitectura', { x:0.5, y:0.22, w:9, h:0.5, fontSize:28, bold:true, fontFace:FONT.h, color:C.white });
  const pillars = [
    { n:'1 bot',                       sub:'Una sola identidad en Discord.\nInstalado en cada servidor de materia.',    c:C.blurple },
    { n:'6 agentes lógicos',           sub:'Especializados por responsabilidad,\nparámetrizados por subject_id.',        c:C.green  },
    { n:'Infraestructura determinista',sub:'Memoria · políticas · envío · crisis:\nreglas auditables, sin autonomía.',    c:C.gold   },
  ];
  pillars.forEach((p, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y:0.9, w:2.9, h:3.8, fill:{ color:C.bgMain }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:0.9, w:2.9, h:0.12, fill:{ color:p.c } });
    s.addText(p.n, { x:x+0.15, y:1.1, w:2.6, h:0.8, fontSize:22, bold:true, fontFace:FONT.h, color:p.c, align:'center' });
    s.addText(p.sub, { x:x+0.15, y:2.0, w:2.6, h:1.5, fontSize:13.5, fontFace:FONT.b, color:C.white, align:'center' });
  });
  s.addText('Las invariantes difíciles (privacidad · modo de ayuda · crisis · envío) viven en infraestructura, no en agentes.', {
    x:0.5, y:4.95, w:9, h:0.4, fontSize:12.5, fontFace:FONT.b, color:C.muted, align:'center',
  });
}

// ─── SLIDE 07 — VISTA PANORÁMICA ─────────────────────────────
function s07() {
  const s = slide();
  title(s, 'Vista panorámica del sistema');
  const agents = Object.values(AGENT);
  const cols = 3, cw = 2.85, ch = 1.8, gap = 0.23;
  agents.forEach((a, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 0.5 + col*(cw+gap), y = 1.05 + row*(ch+0.18);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:cw, h:ch, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:cw, h:0.08, fill:{ color:a.color } });
    circle(s, x+0.15, y+0.2, 0.32, a.id, a.color, C.white);
    s.addText(a.name, { x:x+0.82, y:y+0.22, w:cw-0.95, h:0.38, fontSize:13, bold:true, fontFace:FONT.h, color:a.color });
    s.addText(a.short, { x:x+0.12, y:y+0.85, w:cw-0.2, h:0.85, fontSize:11, fontFace:FONT.b, color:C.muted });
  });
  // Infra strip
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.75, w:9, h:0.55, fill:{ color:C.strip } });
  const infra = ['SubjectRouter','Auth/Role','MemoryStore','SafetyClassifier','InputExtractor','OutputPolicy','Scheduler','OutboundDispatcher'];
  s.addText('Infraestructura: ' + infra.join(' · '), {
    x:0.65, y:4.78, w:8.7, h:0.48, fontSize:10.5, fontFace:FONT.c, color:C.muted,
  });
}

// ─── SLIDE 08 — ¿POR QUÉ 6? ──────────────────────────────────
function s08() {
  const s = slide();
  title(s, '¿Por qué 6 agentes y no más/menos?');
  // Left: muy pocos
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.0, w:2.9, h:3.6, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addText('Muy pocos\n(1–2 generales)', { x:0.6, y:1.05, w:2.7, h:0.55, fontSize:14, bold:true, fontFace:FONT.h, color:C.yellow });
  ['✗ Roles solapados', '✗ Sin especialización', '✗ Difícil de escalar', '✗ Políticas mezcladas'].forEach((t,i) => {
    s.addText(t, { x:0.65, y:1.7+i*0.58, w:2.65, h:0.5, fontSize:13, fontFace:FONT.b, color:C.muted });
  });
  // Right: demasiados
  s.addShape(pres.shapes.RECTANGLE, { x:6.6, y:1.0, w:2.9, h:3.6, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addText('Demasiados\n(10+ especializados)', { x:6.7, y:1.05, w:2.7, h:0.55, fontSize:14, bold:true, fontFace:FONT.h, color:C.yellow });
  ['✗ Handoffs excesivos', '✗ Respuestas incoherentes', '✗ Coordinación costosa', '✗ Más puntos de falla'].forEach((t,i) => {
    s.addText(t, { x:6.65, y:1.7+i*0.58, w:2.65, h:0.5, fontSize:13, fontFace:FONT.b, color:C.muted });
  });
  // Center: our choice
  s.addShape(pres.shapes.RECTANGLE, { x:3.6, y:1.0, w:2.8, h:3.6, fill:{ color:C.blurple }, shadow:mkShadow() });
  s.addText('Nuestra elección', { x:3.7, y:1.08, w:2.6, h:0.38, fontSize:14, bold:true, fontFace:FONT.h, color:C.white, align:'center' });
  s.addText('6 agentes\nlógicos', { x:3.7, y:1.5, w:2.6, h:0.8, fontSize:26, bold:true, fontFace:FONT.h, color:C.white, align:'center' });
  ['✔ Responsabilidades claras', '✔ Conversación coherente', '✔ Invariantes en infra', '✔ Degradación aislada'].forEach((t,i) => {
    s.addText(t, { x:3.7, y:2.45+i*0.54, w:2.6, h:0.48, fontSize:12.5, fontFace:FONT.b, color:C.white, align:'center' });
  });
}

// ─── SLIDES 09–14 — FICHAS AGENTES ───────────────────────────
const FICHA_DATA = {
  A1: {
    rol:   'Punto de entrada lógico del estudiante. Coordinador del intercambio.',
    resp:  ['Clasifica intención en cada turno', 'Aplica SafetyClassifier (frontera de seguridad)', 'Deriva a A2/A3/A5 o ensambla respuestas mixtas', 'Reconducción educada ante fuera de dominio', 'Escala crisis de bienestar al protocolo institucional'],
    rec:   ['subject_id · canal · visibilidad', 'STM: conversation_owner_agent, active_intent', 'SafetyClassifier · CrisisCaseStore', 'Catálogo de agentes y reglas de derivación'],
    out:   ['No inventa teoría ni reglas', 'No escribe directamente en Discord', 'No gestiona casos de crisis por sí mismo'],
    bdi:   'Cree: contexto saneado + nivel de crisis  |  Busca: respuesta correcta y segura  |  Hace: deriva, ensambla o escala',
    char:  'Reactivo + Social',
  },
  A2: {
    rol:   'Tutor pedagógico integrado: teoría, práctica/código y autoevaluación.',
    resp:  ['Explica teoría con distinto nivel de profundidad', 'Analiza código, detecta errores conceptuales', 'Genera y evalúa quizzes y checklists de estudio', 'Aplica assistance_mode sin entregar soluciones', '2ª barrera de crisis si el turno llegó por continuidad'],
    rec:   ['KB vigente (material pedagógico)', 'Código validado por InputExtractor', 'OutputPolicy → assistance_mode', 'Memoria pedagógica mínima permitida (LTM)'],
    out:   ['No responde fechas oficiales', 'No entrega soluciones evaluables completas', 'No califica ni tramita; no inicia contactos'],
    bdi:   'Cree: pedido + fuentes + modo permitido  |  Busca: progreso autónomo del estudiante  |  Hace: explica, guía o autoevalúa',
    char:  'Reactivo + Social',
  },
  A3: {
    rol:   'Orientador administrativo: información publicada y derivación de casos.',
    resp:  ['Responde fechas, modalidad y reglas publicadas', 'Cita Config Store como única fuente', '"No consta" es una respuesta válida', 'Deriva casos particulares al canal humano designado'],
    rec:   ['Config Store vigente (fechas, reglas, evaluativas)', 'Canales humanos designados (bedelía, cátedra, etc.)'],
    out:   ['No decide si un alumno califica para una excepción', 'No gestiona trámites ni valida certificados', 'No contacta proactivamente ni anticipa decisiones'],
    bdi:   'Cree: consulta + configuración vigente  |  Busca: exactitud  |  Hace: cita la regla o deriva al canal humano',
    char:  'Reactivo',
  },
  A4: {
    rol:   'Seguimiento proactivo y acotado por DM.',
    resp:  ['Lee oportunidades LTM (duda abierta, quiz, estado stuck)', 'Redacta un único DM suave por contacto', 'Incluye siempre /seguimiento desactivar', 'Registra entrega o fallo; marca dm_contactable=false si Discord rechaza'],
    rec:   ['LTM mínima: tema, duda, estado, quiz', 'follow_up_enabled (default true) y dm_contactable', 'Cooldown + horarios de silencio', 'Config Store (hitos próximos)'],
    out:   ['No contacta tras opt-out', 'No usa canales públicos como fallback', 'No enseña ni da información administrativa', 'Pausa mientras haya caso de crisis activo'],
    bdi:   'Cree: oportunidades consentidas entregables por DM  |  Busca: continuidad no intrusiva  |  Hace: envía o pospone',
    char:  'Proactivo',
  },
  A5: {
    rol:   'Canal de escucha voluntario entre estudiantes y cátedra.',
    resp:  ['Recibe /feedback y respuestas voluntarias', 'Clasifica en ejes: cursada · material · asistente', 'Anonimato "anónimo" por defecto', 'Escala odio/ataques a autoridad designada (no al digest)', 'Arma digest agregado semanal (muestra mínima)'],
    rec:   ['Feedback Store por materia', 'Política de anonimato y destino docente', 'Canal docente de digest (solo escribe, no lee canal alumnos)'],
    out:   ['No infiere feedback desde quizzes ni actividad', 'No reemplaza evaluaciones oficiales', 'No publica detalle privado (DM) en digest'],
    bdi:   'Cree: aportes voluntarios + política de agregación  |  Busca: señales útiles para la cátedra  |  Hace: modera y entrega digest',
    char:  'Reactivo + Social',
  },
  A6: {
    rol:   'Curador del conocimiento vivo aportado por la cátedra.',
    resp:  ['Pipeline content: /incorporar-material → KB Store', 'Pipeline config: /actualizar-catedra → Config Store', 'Sugiere el pipeline correcto si detecta intención distinta', 'Versiona y difiere conflictos ambiguos a confirmación docente'],
    rec:   ['KB Store y Config Store por materia', 'Rol docente/ayudante autorizado (Auth/Role Check)', 'Política de versionado y vigencia'],
    out:   ['No valida corrección académica del contenido', 'No modifica KB/Config de otra materia', 'No lee canales de estudiantes ni procesa DMs'],
    bdi:   'Cree: aporte recibido + estado vigente de KB/Config  |  Busca: coherencia documental  |  Hace: versiona o consulta al docente',
    char:  'Reactivo + Social',
  },
};

function agentFicha(id) {
  const a = AGENT[id];
  const d = FICHA_DATA[id];
  const s = slide();
  const ac = a.color;
  const charBg = d.char.includes('Proactivo') ? C.pink : (d.char.includes('Social') ? C.blurple : C.yellow);

  // Header: circle + name + badge
  s.addShape(pres.shapes.OVAL, { x:0.5, y:0.18, w:0.95, h:0.95, fill:{ color:ac } });
  s.addText(id, { x:0.5, y:0.18, w:0.95, h:0.95, fontSize:26, bold:true, fontFace:FONT.h, color:C.white, align:'center', valign:'middle', margin:0 });
  s.addText(a.name, { x:1.62, y:0.18, w:7.5, h:0.48, fontSize:28, bold:true, fontFace:FONT.h, color:ac });
  // Badge below the name (not to the right where it crowds)
  const bw = pill(s, 1.62, 0.72, d.char, charBg, C.white);
  s.addText(d.rol, { x:1.62+bw+0.18, y:0.7, w:7.5-bw-0.18, h:0.4, fontSize:11, fontFace:FONT.b, color:C.muted });

  // 4 cards in 2×2 grid — no ROL duplication
  const cx1 = 0.5, cx2 = 5.0, cw = 4.3, ch = 1.55;
  const ry1 = 1.25, ry2 = 2.92;

  card(s, cx1, ry1, cw, ch, 'RESPONSABILIDADES', d.resp, ac);
  card(s, cx2, ry1, cw, ch, 'RECURSOS', d.rec, ac);
  card(s, cx1, ry2, cw, ch, 'FUERA DE ALCANCE', d.out, ac);
  // BDI as 4th card
  const bdiLines = d.bdi.split('  |  ');
  card(s, cx2, ry2, cw, ch, 'BDI (Beliefs · Desires · Intentions)', bdiLines, ac);
}

// ─── SLIDE 15 — INFRAESTRUCTURA DETERMINISTA ─────────────────
function s15() {
  const s = slide();
  title(s, 'Infraestructura determinista (no son agentes)', { fs: 28 });
  subtitle(s, 'Reglas verificables sin autonomía — convertirlas en agentes sumaría coordinación sin valor');
  const rows = [
    ['SubjectRouter',            'Resuelve guild_id → subject_id',                       'Lookup determinista'],
    ['Auth / Role Check',        'Valida usuario, rol y permisos',                       'Control de acceso'],
    ['MemoryStore',              'STM, LTM y preferencias por usuario+materia',          'Aplica reglas de datos'],
    ['SafetyClassifier',         'Asigna crisis_level a cada turno',                     'Política de seguridad humana'],
    ['CrisisCaseStore',          'Deduplicación de casos y thread_id por user+materia',  'Registro auditado'],
    ['CrisisEscalationProtocol', 'Crea/actualiza hilo privado de crisis para cátedra',   'Protocolo institucional'],
    ['InputExtractor',           'Extrae bloque/adjunto de código del mensaje actual',   'Transformación de formato'],
    ['OutputPolicy',             'Calcula assistance_mode · valida privacidad',          'Política auditable'],
    ['Scheduler',                'Dispara A4 entre 2–5 días post-sesión',                'Temporización'],
    ['OutboundDispatcher',       'Envía mensajes en Discord · registra fallos',          'Único actuador físico ←'],
  ];
  const hdr = [
    { text:'Componente',     options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:11 } },
    { text:'Responsabilidad',options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:11 } },
    { text:'Por qué no es agente', options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:11 } },
  ];
  const tableRows = [hdr, ...rows.map(r => r.map((cell, ci) => ({
    text: cell,
    options: { fontSize:10.5, color: ci === 2 ? C.muted : C.white, fontFace:FONT.b },
  })))];
  s.addTable(tableRows, {
    x:0.5, y:1.28, w:9, h:3.87,
    colW:[2.2, 4.3, 2.5],
    border:{ pt:1, color:'383A40' },
    fill:{ color:C.bgCard },
    rowH: 0.37,
  });
}

// ─── SLIDE 16 — CARÁCTER BDI ─────────────────────────────────
function s16() {
  const s = slide();
  title(s, 'Carácter de los agentes: Reactivo · Proactivo · Social', { fs: 26 });
  // Matrix table
  const dot = '●', mdash = '—';
  const hdr = [
    { text:'Agente', options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:12 } },
    { text:'Reactivo', options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:12, align:'center' } },
    { text:'Proactivo', options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:12, align:'center' } },
    { text:'Social', options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:12, align:'center' } },
  ];
  const matrixRows = [
    ['A1 Frontier',         dot,   mdash, dot  ],
    ['A2 Tutor',            dot,   mdash, dot  ],
    ['A3 Admin',            dot,   mdash, mdash],
    ['A4 Follow-up',        mdash, dot,   mdash],
    ['A5 Feedback',         dot,   mdash, dot  ],
    ['A6 Knowledge Curator',dot,   mdash, dot  ],
  ];
  const tRows = [hdr, ...matrixRows.map((r,i) => r.map((cell,ci) => ({
    text: cell,
    options: {
      fontSize:13, color: ci===0 ? Object.values(AGENT)[i].color : (cell===dot ? C.green : C.dim),
      fontFace:FONT.b, align: ci>0 ? 'center':'left',
      bold: cell===dot,
    },
  })))];
  s.addTable(tRows, { x:0.5, y:1.0, w:5.5, h:3.8, colW:[2.4,1.0,1.0,1.1], border:{ pt:1, color:'383A40' }, fill:{ color:C.bgCard }, rowH:0.52 });

  // Contrast box A3 vs A4
  s.addShape(pres.shapes.RECTANGLE, { x:6.2, y:1.0, w:3.3, h:3.8, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:6.2, y:1.0, w:0.07, h:3.8, fill:{ color:C.blurple } });
  s.addText('Contraste obligatorio', { x:6.35, y:1.05, w:3.0, h:0.35, fontSize:12, bold:true, fontFace:FONT.b, color:C.blurple });
  s.addShape(pres.shapes.RECTANGLE, { x:6.3, y:1.5, w:3.0, h:1.2, fill:{ color:C.bgMain } });
  s.addText('A3 Admin — Reactivo', { x:6.4, y:1.54, w:2.8, h:0.3, fontSize:12, bold:true, fontFace:FONT.b, color:C.yellow });
  s.addText('Solo contesta reglas cuando recibe consulta. Anticipar decisiones admin podría confundir comunicaciones oficiales.', { x:6.4, y:1.84, w:2.8, h:0.78, fontSize:10.5, fontFace:FONT.b, color:C.muted });
  s.addShape(pres.shapes.RECTANGLE, { x:6.3, y:2.8, w:3.0, h:1.2, fill:{ color:C.bgMain } });
  s.addText('A4 Follow-up — Proactivo', { x:6.4, y:2.84, w:2.8, h:0.3, fontSize:12, bold:true, fontFace:FONT.b, color:C.pink });
  s.addText('Inicia contacto 2–5 días post-sesión. El seguimiento exige autonomía. Mantenerlos separados evita que información adquiera iniciativa intrusiva.', { x:6.4, y:3.15, w:2.8, h:0.78, fontSize:10.5, fontFace:FONT.b, color:C.muted });
}

// ─── SLIDE 17 — COORDINACIÓN ─────────────────────────────────
function s17() {
  const s = slide();
  title(s, 'Coordinación — Pipeline de 9 pasos');
  subtitle(s, '"Sticky con preflight": A1 re-decide intención en cada turno antes de usar continuidad');
  const steps = [
    ['1', 'Gateway',         'Mensaje dirigido al bot',                C.blurple],
    ['2', 'Auth + Router',   'Valida rol, fija subject_id',            C.blurple],
    ['3', 'A1 Frontier',     'SafetyClassifier + inferir intención',   C.blurple],
    ['4', 'Crisis check',    'crisis_level → CrisisEscalationProtocol',C.red   ],
    ['5', 'Ruteo',           'Continúa o reorquesta a agente',         C.blurple],
    ['6', 'OutputPolicy①',  'Calcula assistance_mode',                 C.yellow ],
    ['7', 'Agente',          'Produce borrador o decisión',            C.green  ],
    ['8', 'OutputPolicy②',  'Valida privacidad + restricción pedagóg.',C.yellow ],
    ['9', 'Dispatcher',      'Publica bajo identidad única del bot',   C.blurple],
  ];
  steps.forEach((st, i) => {
    const row = Math.floor(i / 3), col = i % 3;
    const x = 0.5 + col*3.1, y = 1.2 + row*1.38;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:2.85, h:1.18, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:2.85, h:0.06, fill:{ color:st[3] } });
    circle(s, x+0.1, y+0.15, 0.22, st[0], st[3], C.white);
    s.addText(st[1], { x:x+0.58, y:y+0.12, w:2.15, h:0.32, fontSize:13, bold:true, fontFace:FONT.h, color:C.white });
    s.addText(st[2], { x:x+0.1,  y:y+0.58, w:2.65, h:0.52, fontSize:11, fontFace:FONT.b, color:C.muted });
  });
}

// ─── SLIDE 18 — RUTEO ────────────────────────────────────────
function s18() {
  const s = slide();
  title(s, 'Ruteo y fuera de dominio');
  const hdr = [
    { text:'Evento / intent',    options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:11 } },
    { text:'Primer agente',      options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:11 } },
    { text:'Ruta',               options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:11 } },
  ];
  const rows = [
    ['Teoría · quiz · checklist',           'A1',  '→ A2 → OutputPolicy → Dispatcher'],
    ['Práctica o código',                   'A1',  '→ OutputPolicy(modo) → A2 → Dispatcher'],
    ['Pedido de solución evaluable',        'A1',  '→ OutputPolicy(refuse_solution) → A2(guía)'],
    ['Fecha · regla · modalidad',           'A1',  '→ A3 → Dispatcher'],
    ['Consulta mixta (pedagogía + admin)',   'A1',  '→ A2 + A3 → A1 ensambla → Dispatcher'],
    ['/feedback del estudiante',            'A1',  '→ A5 → digest docente'],
    ['Señal de crisis / autolesión',        'A1',  '→ CrisisEscalationProtocol → hilo docente'],
    ['Tick de seguimiento (2–5 días)',       'A4',  '→ DM si dm_contactable=true'],
    ['/incorporar-material (docente)',       'A6',  '→ pipeline content → KB Store'],
    ['/actualizar-catedra (docente)',        'A6',  '→ pipeline config → Config Store'],
  ];
  const tRows = [hdr, ...rows.map(r => r.map((c,ci) => ({
    text:c, options:{ fontSize:10.5, fontFace:FONT.b, color:ci===1?C.blurple:C.white },
  })))];
  s.addTable(tRows, { x:0.5, y:0.95, w:9, h:3.85, colW:[3.1,1.3,4.6], border:{ pt:1, color:'383A40' }, fill:{ color:C.bgCard }, rowH:0.33 });
  // Out of domain callout
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.92, w:9, h:0.45, fill:{ color:C.strip } });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.92, w:0.07, h:0.45, fill:{ color:C.yellow } });
  s.addText('Fuera de dominio → A1 responde de forma educada ("está fuera del dominio del asistente") y orienta al canal docente o instancia humana designada.', {
    x:0.65, y:4.94, w:8.7, h:0.4, fontSize:11, fontFace:FONT.b, color:C.white,
  });
}

// ─── SLIDE 19 — POLÍTICA DE AYUDA ────────────────────────────
function s19() {
  const s = slide();
  title(s, 'Política de ayuda práctica — assistance_mode', { fs: 28 });
  subtitle(s, 'OutputPolicy decide la postura por respuesta — no vigila cadenas incrementales');
  const modes = [
    { m:'normal',         bg:C.green,  t:'Práctica no entregable',  d:'Explicación completa, diagnóstico y próximos pasos. Sin restricción adicional.' },
    { m:'guided_only',    bg:C.yellow, t:'Consulta sobre TP activo', d:'Categoría de error, pista conceptual o próximo paso. Nunca código final ni solución.' },
    { m:'refuse_solution',bg:C.red,    t:'Pedido de solución lista', d:'Negativa breve y guía conceptual mínima. No entrega el trabajo para presentar.' },
  ];
  modes.forEach((m, i) => {
    const x = 0.5 + i*3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.2, w:2.85, h:3.5, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.2, w:2.85, h:0.1,  fill:{ color:m.bg } });
    s.addText(m.m, { x:x+0.15, y:1.38, w:2.55, h:0.45, fontSize:17, bold:true, fontFace:FONT.c, color:m.bg });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.15, y:1.9, w:2.55, h:0.42, fill:{ color:C.bgMain } });
    s.addText(m.t, { x:x+0.15, y:1.9, w:2.55, h:0.42, fontSize:12, bold:true, fontFace:FONT.b, color:C.white, align:'center', valign:'middle' });
    s.addText(m.d, { x:x+0.15, y:2.42, w:2.55, h:1.1, fontSize:12.5, fontFace:FONT.b, color:C.muted });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.9, w:9, h:0.42, fill:{ color:C.strip } });
  s.addText('El límite es por respuesta individual. Conversaciones incrementales ("¿qué hace esta función?" → "¿así está bien?") no se bloquean: ese control queda en criterio docente.', {
    x:0.65, y:4.92, w:8.7, h:0.38, fontSize:10.5, fontFace:FONT.b, color:C.muted,
  });
}

// ─── SLIDE 20 — MULTI-MATERIA ─────────────────────────────────
function s20() {
  const s = slide();
  title(s, 'Multi-materia — "1 materia = 1 servidor"', { fs: 30 });
  // Big statement
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.95, w:9, h:0.72, fill:{ color:C.blurple }, shadow:mkShadow() });
  s.addText('Mismo bot · mismos 6 agentes genéricos · subject_id diferente por servidor', {
    x:0.7, y:0.97, w:8.6, h:0.68, fontSize:17, bold:true, fontFace:FONT.h, color:C.white, align:'center', valign:'middle',
  });
  // Stores table
  const hdr = [
    { text:'Store',          options:{ bold:true, color:C.white, fill:{ color:'3A3C43' }, fontSize:11 } },
    { text:'Partición',      options:{ bold:true, color:C.white, fill:{ color:'3A3C43' }, fontSize:11 } },
    { text:'Escritor / Lector', options:{ bold:true, color:C.white, fill:{ color:'3A3C43' }, fontSize:11 } },
  ];
  const storeRows = [
    ['KB Store',          'materia',         'A6 escribe · A2 lee'],
    ['Config Store',      'materia',         'A6 escribe · A3, A4, OutputPolicy leen'],
    ['Memory Store',      'usuario + materia','Infra · A1/A2/A4 consumen según permiso'],
    ['Feedback Store',    'materia',         'A5'],
    ['Crisis Case Store', 'usuario + materia','CrisisEscalationProtocol · docentes cátedra'],
  ];
  const tRows = [hdr, ...storeRows.map(r => r.map((c,ci) => ({
    text:c, options:{ fontSize:11, fontFace:FONT.b, color:ci===0?C.teal:C.white },
  })))];
  s.addTable(tRows, { x:0.5, y:1.85, w:9, h:2.35, colW:[2.2,2.3,4.5], border:{ pt:1, color:'383A40' }, fill:{ color:C.bgCard }, rowH:0.38 });

  const notes = [
    { t:'DM ambiguo', d:'A1 pregunta la materia antes de derivar. La elección se guarda en STM.', c:C.yellow },
    { t:'Garantía de aislamiento', d:'Un aporte en Álgebra II nunca toca KB/Config de Programación II.', c:C.green },
  ];
  notes.forEach((n,i) => {
    card(s, 0.5+i*4.65, 4.35, 4.3, 0.95, n.t, [n.d], n.c);
  });
}

// ─── SLIDE 21 — MEMORIA ENTRE SESIONES ───────────────────────
function s21() {
  const s = slide();
  title(s, 'Memoria entre sesiones');
  // STM vs LTM
  const cols = [
    { h:'STM — intra-sesión', c:C.yellow, items:['Coordina el intercambio actual','subject_id en DM, intención activa, conversation_owner_agent','Se descarta al cerrar la sesión','Nunca usada de forma proactiva'] },
    { h:'LTM — entre sesiones', c:C.green, items:['Continuidad y seguimiento pedagógico','Tema/duda (abierta/cerrada), quiz, estado de trabajo','Preferencias: follow_up_enabled, dm_contactable','Vida: cursada + 6 meses; borrable por el estudiante'] },
  ];
  cols.forEach((col, i) => {
    const x = 0.5 + i*4.7;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.0, w:4.3, h:2.25, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.0, w:4.3, h:0.08, fill:{ color:col.c } });
    s.addText(col.h, { x:x+0.15, y:1.13, w:4.0, h:0.35, fontSize:14, bold:true, fontFace:FONT.h, color:col.c });
    const items = col.items.map((t,j) => ({ text:t, options:{ bullet:true, breakLine:j<col.items.length-1, fontSize:12, color:C.white, fontFace:FONT.b }}));
    s.addText(items, { x:x+0.15, y:1.52, w:4.0, h:1.65, fontFace:FONT.b, fontSize:12, color:C.white });
  });

  // NOT persisted
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.42, w:4.3, h:0.88, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.42, w:0.07, h:0.88, fill:{ color:C.red } });
  s.addText('NO se persiste', { x:0.65, y:3.48, w:3.9, h:0.3, fontSize:12, bold:true, fontFace:FONT.b, color:C.red });
  s.addText('Transcripciones crudas · código fuente · señales antifraude multi-turno · datos médicos · certificados', {
    x:0.65, y:3.8, w:3.9, h:0.45, fontSize:10.5, fontFace:FONT.b, color:C.muted,
  });

  // Comandos del estudiante
  s.addShape(pres.shapes.RECTANGLE, { x:5.0, y:3.42, w:4.5, h:1.85, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:5.0, y:3.42, w:0.07, h:1.85, fill:{ color:C.teal } });
  s.addText('Control del estudiante', { x:5.15, y:3.48, w:4.1, h:0.3, fontSize:12, bold:true, fontFace:FONT.b, color:C.teal });
  const cmds = ['/mi-historial · /borrar-historial · /restablecer-perfil','/seguimiento desactivar   /seguimiento activar','/activar-dm'];
  cmds.forEach((c,i) => s.addText(c, { x:5.15, y:3.82+i*0.43, w:4.1, h:0.38, fontSize:11, fontFace:FONT.c, color:C.white }));
}

// ─── SLIDE 22 — SEGUIMIENTO PROACTIVO A4 ─────────────────────
function s22() {
  const s = slide();
  title(s, 'Seguimiento proactivo — A4 Follow-up');
  subtitle(s, 'Habilitado por default · opt-out disponible · solo por DM · ventana 2–5 días post-sesión');

  // Timeline
  const events = [
    { x:0.5,  label:'Día 1',        detail:'Estudiante pide quiz de pilas en DM\nA2 genera quiz y devolución\nA2 → LTM: tema=pilas, duda=abierta', c:C.green },
    { x:3.6,  label:'Sesión cierra',detail:'Inactividad (~30–60 min)\nMemoryStore conserva el hecho mínimo\nfollow_up_enabled=true, dm_contactable=true', c:C.yellow },
    { x:6.7,  label:'Día 4 (~2–5d)',detail:'Scheduler evalúa oportunidad\nA4 redacta DM suave:\n"¿Querés retomar pilas? /seguimiento desactivar"', c:C.blurple },
  ];
  events.forEach((ev) => {
    s.addShape(pres.shapes.RECTANGLE, { x:ev.x, y:1.1, w:3.0, h:2.6, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x:ev.x, y:1.1, w:3.0, h:0.08, fill:{ color:ev.c } });
    s.addText(ev.label, { x:ev.x+0.15, y:1.22, w:2.7, h:0.38, fontSize:15, bold:true, fontFace:FONT.h, color:ev.c });
    s.addText(ev.detail, { x:ev.x+0.15, y:1.65, w:2.7, h:1.9, fontSize:11.5, fontFace:FONT.b, color:C.white });
  });
  // Arrow connectors
  [[3.5, 2.37],[6.6, 2.37]].forEach(([x,y]) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.1, h:0.05, fill:{ color:C.muted } });
    s.addText('→', { x:x-0.05, y:y-0.18, w:0.2, h:0.36, fontSize:18, color:C.muted, align:'center' });
  });

  // Rules
  const rules = [
    { t:'Dispatcher envía o registra fallo', d:'Si Discord rechaza el DM → dm_contactable=false. Sin fallback público.', c:C.red },
    { t:'Anti-spam', d:'Cooldown entre contactos · horarios de silencio · un solo tema por mensaje', c:C.yellow },
    { t:'Pausa automática', d:'Si hay caso de crisis activo o safety_hold_until vigente → A4 se suspende', c:C.pink },
  ];
  rules.forEach((r, i) => {
    card(s, 0.5+i*3.1, 4.0, 2.85, 0.85, r.t, [r.d], r.c);
  });
}

// ─── SLIDE 23 — CRISIS DE BIENESTAR ──────────────────────────
function s23() {
  const s = slide(C.bgDeep);
  s.addText('Crisis de bienestar y autolesión', {
    x:0.5, y:0.22, w:9, h:0.55, fontSize:34, bold:true, fontFace:FONT.h, color:C.red,
  });
  subtitle(s, 'Excepción de seguridad humana — actúa antes que cualquier flujo pedagógico', { color:C.muted });
  // crisis_level chips
  const levels = [
    { l:'none',                 c:C.dim,   d:'Sin señal → flujo normal' },
    { l:'distress',             c:C.yellow,d:'Malestar intenso → contención + pausa A4' },
    { l:'self_harm_ambiguous',  c:C.gold,  d:'Crear / actualizar caso' },
    { l:'self_harm_explicit',   c:C.red,   d:'Crear / actualizar caso urgente' },
    { l:'imminent_risk',        c:C.red,   d:'Prioridad máxima + remarcar urgencia' },
  ];
  levels.forEach((lv, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.15+i*0.72, w:3.1, h:0.58, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.15+i*0.72, w:0.07, h:0.58, fill:{ color:lv.c } });
    s.addText(lv.l, { x:0.65, y:1.18+i*0.72, w:2.75, h:0.28, fontSize:12, bold:true, fontFace:FONT.c, color:lv.c });
    s.addText(lv.d, { x:0.65, y:1.47+i*0.72, w:2.75, h:0.2,  fontSize:10.5, fontFace:FONT.b, color:C.muted });
  });
  // Right: flow
  const flow = [
    'A1 aplica SafetyClassifier en cada turno',
    'A2 / A5 actúan como 2ª barrera si el turno llegó por continuidad',
    'CrisisCaseStore deduplica: 1 hilo por user+materia',
    'Dispatcher crea hilo privado en #alertas-bienestar-catedra',
    'Paquete de crisis: usuario · materia · canal · timestamps · transcripción completa',
    'Bot → estudiante: contención breve + orientación institucional',
    'Docentes elevan a psicología/bienestar de la facultad',
    'A4 queda pausado mientras el caso esté open / acknowledged / escalated',
  ];
  flow.forEach((f, i) => {
    circle(s, 3.8, 1.1+i*0.57, 0.18, String(i+1), i===0?C.red:C.blurple, C.white);
    s.addText(f, { x:4.22, y:1.04+i*0.57, w:5.4, h:0.52, fontSize:11.5, fontFace:FONT.b, color:C.white, valign:'middle' });
  });
}

// ─── SLIDE 24 — DISCORD: 5 ESPACIOS + MATRIZ ─────────────────
function s24() {
  const s = slide();
  title(s, 'Discord: 5 espacios · Matriz agente–ambiente', { fs: 28 });
  // Spaces row
  const spaces = [
    { t:'Canal\nestudiantes', d:'Consultas públicas @bot o /cmd', c:C.blurple },
    { t:'DM estudiante-bot', d:'Código sensible · quiz · seguimiento', c:C.green },
    { t:'Canal docente\naporte',  d:'/incorporar-material · /actualizar-catedra', c:C.gold },
    { t:'Canal docente\ndigest',  d:'Bot publica resumen A5 · semanal', c:C.teal },
    { t:'Canal docente\ncrisis',  d:'Hilo privado por crisis (CrisisEscalationProtocol)', c:C.red },
  ];
  spaces.forEach((sp, i) => {
    const x = 0.35+i*1.86;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.0, w:1.7, h:0.95, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.0, w:1.7, h:0.08, fill:{ color:sp.c } });
    s.addText(sp.t, { x:x+0.08, y:1.12, w:1.54, h:0.38, fontSize:10, bold:true, fontFace:FONT.b, color:sp.c });
    s.addText(sp.d, { x:x+0.08, y:1.52, w:1.54, h:0.38, fontSize:9, fontFace:FONT.b, color:C.muted });
  });

  // Matrix
  const matHdr = [
    { text:'Agente',            options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10 } },
    { text:'Canal estud.',      options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10, align:'center' } },
    { text:'DM',                options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10, align:'center' } },
    { text:'Aporte docente',    options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10, align:'center' } },
    { text:'Digest docente',    options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10, align:'center' } },
    { text:'Crisis docente',    options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10, align:'center' } },
  ];
  const P='P/B', pP='(P)/B', B='B', D='—';
  const matRows = [
    ['A1 Frontier',        P,   P,   D,   D,   'B alerta'],
    ['A2 Tutor',           pP,  pP,  D,   D,   D],
    ['A3 Admin',           pP,  pP,  D,   D,   D],
    ['A4 Follow-up',       D,   pP,  D,   D,   D],
    ['A5 Feedback',        pP,  pP,  D,   B,   'B alerta'],
    ['A6 Curator',         D,   D,   P+'/B', D, D],
    ['OutboundDispatcher', 'Escribe','Escribe','Confirmación','Digest','Hilo crisis'],
  ];
  const tRows = [matHdr, ...matRows.map((r,ri) => r.map((c,ci) => ({
    text:c,
    options:{
      fontSize:9.5, fontFace:FONT.b,
      color: c===D ? C.dim : (ci===0 ? (ri<6?Object.values(AGENT)[ri]?.color||C.white:C.muted) : (c.includes('Escribe')||c.includes('Hilo')||c.includes('Digest')||c.includes('Confirma')?C.green:(c===P||c===pP?C.teal:C.white))),
      align: ci>0?'center':'left',
    },
  })))];
  s.addTable(tRows, { x:0.35, y:2.1, w:9.3, h:3.15, colW:[2.1,1.3,1.1,1.6,1.6,1.6], border:{ pt:1, color:'383A40' }, fill:{ color:C.bgCard }, rowH:0.37 });
  subtitle(s, 'P = percibe · (P) = recibe contexto saneado · B = produce borrador · — = prohibición de diseño', { y:5.3, fs:10, color:C.dim });
}

// ─── SLIDE 25 — CÓDIGO + APORTE DOCENTE ──────────────────────
function s25() {
  const s = slide();
  title(s, 'Ingreso de código · Canal de aporte docente', { fs: 28 });
  // Left: code entry
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.0, w:4.3, h:3.85, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.0, w:0.07, h:3.85, fill:{ color:C.green } });
  s.addText('Ingreso de código', { x:0.65, y:1.06, w:3.9, h:0.38, fontSize:15, bold:true, fontFace:FONT.h, color:C.green });
  const codeItems = [
    'Bloque de código en el mensaje dirigido al bot',
    'Adjunto textual: .py · .java · .c · .js · .txt',
    'Límite: ~100 KB / 2000 líneas (configurable)',
    '→ InputExtractor valida tamaño y formato',
    '→ A1 deriva a A2 con el texto validado',
    '→ OutputPolicy fija assistance_mode',
    'Si el adjunto está ilegible o no hay código:\n   el bot pide reenviar — no improvisa análisis',
    'Si el mensaje es público y el código es sensible:\n   se sugiere continuar por DM',
  ];
  const codeObjs = codeItems.map((t,i) => ({ text:t, options:{ bullet:true, breakLine:i<codeItems.length-1, fontSize:11.5, fontFace:FONT.b, color:C.white }}));
  s.addText(codeObjs, { x:0.65, y:1.52, w:3.9, h:3.2, fontFace:FONT.b, fontSize:11.5, color:C.white });

  // Right: 2 pipelines
  s.addShape(pres.shapes.RECTANGLE, { x:5.0, y:1.0, w:4.5, h:3.85, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:5.0, y:1.0, w:0.07, h:3.85, fill:{ color:C.gold } });
  s.addText('2 pipelines de aporte docente (A6)', { x:5.15, y:1.06, w:4.2, h:0.38, fontSize:14, bold:true, fontFace:FONT.h, color:C.gold });
  const pipes = [
    { cmd:'/incorporar-material', dest:'KB Store',     pipe:'content', color:C.green, desc:'Material pedagógico: apuntes, bibliografía, PDF, programas, explicaciones.\nDefault — siempre incorpora aunque mencione fechas.' },
    { cmd:'/actualizar-catedra',  dest:'Config Store', pipe:'config',  color:C.teal,  desc:'Datos estructurados: fechas, reglas, evaluativas activas, modalidad.\nParseo estructurado + versionado + validación.' },
  ];
  pipes.forEach((p, i) => {
    const y = 1.52 + i*1.65;
    s.addShape(pres.shapes.RECTANGLE, { x:5.15, y, w:4.2, h:1.48, fill:{ color:C.bgMain } });
    s.addText(p.cmd, { x:5.25, y:y+0.06, w:4.0, h:0.32, fontSize:12, bold:true, fontFace:FONT.c, color:p.color });
    s.addText(`→ pipeline ${p.pipe} → ${p.dest}`, { x:5.25, y:y+0.4, w:4.0, h:0.28, fontSize:11, fontFace:FONT.b, color:C.muted });
    s.addText(p.desc, { x:5.25, y:y+0.7, w:4.0, h:0.72, fontSize:11, fontFace:FONT.b, color:C.white });
  });
  s.addText('Si A6 detecta intención admin en /incorporar-material → sugiere /actualizar-catedra sin descartar el aporte.', {
    x:5.15, y:4.72, w:4.2, h:0.38, fontSize:10.5, fontFace:FONT.b, color:C.muted,
  });
}

// ─── SLIDE 26 — PRIVACIDAD PÚBLICO vs DM ─────────────────────
function s26() {
  const s = slide();
  title(s, 'Privacidad: canal público vs DM');
  // Two main blocks
  const blocks = [
    { t:'Canal público', icon:'📢', c:C.blurple,
      items:['Consultas y respuestas visibles para todos los lectores del canal', 'OutputPolicy impide mezclar datos de origen DM', 'No se publican datos privados en respuesta pública', 'Código sensible → bot sugiere continuar por DM'] },
    { t:'DM (privado 1:1)', icon:'🔒', c:C.green,
      items:['Consultas confidenciales para todos los demás miembros', 'Memoria, feedback a docentes y digests no re-publican contenido de DM', 'A4 solo contacta por DM; si falla → delivery_failed, sin fallback público', 'Snapshot de crisis: única excepción explícita y auditada'] },
  ];
  blocks.forEach((b, i) => {
    const x = 0.5+i*4.7;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.0, w:4.3, h:2.9, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.0, w:4.3, h:0.08, fill:{ color:b.c } });
    s.addText(b.t, { x:x+0.15, y:1.12, w:4.0, h:0.4, fontSize:17, bold:true, fontFace:FONT.h, color:b.c });
    const items = b.items.map((t,j) => ({ text:t, options:{ bullet:true, breakLine:j<b.items.length-1, fontSize:12, color:C.white, fontFace:FONT.b }}));
    s.addText(items, { x:x+0.15, y:1.6, w:4.0, h:2.2, fontFace:FONT.b, fontSize:12, color:C.white });
  });

  card(s, 0.5, 4.05, 4.3, 1.15, 'Transferencia consentida', ['Estudiante pide explícitamente compartir un fragmento de DM. A1 valida, OutputPolicy autoriza solo ese fragmento, Dispatcher publica con trazabilidad.'], C.yellow);
  card(s, 5.0, 4.05, 4.5, 1.15, 'Excepción de crisis', ['Señal de autolesión → el sistema crea hilo privado docente con transcripción. No se publica en canales estudiantiles. Finalidad: seguridad humana, no monitoreo.'], C.red);
}

// ─── SLIDES 27–30 — ESCENARIOS ───────────────────────────────
function scenarioSlide(letter, titleText, contextLines, diagramId, accent) {
  const s = slide();
  // Compact title
  s.addText(`Escenario ${letter} — ${titleText}`, {
    x:0.5, y:0.12, w:9, h:0.48, fontSize:22, bold:true, fontFace:FONT.h, color:accent||C.blurple,
  });
  // 3 key context bullets as a slim strip
  const top3 = contextLines.slice(0,3);
  const ctx = top3.map((t,i) => ({ text:t, options:{ bullet:true, breakLine:i<top3.length-1, fontSize:11.5, color:C.white, fontFace:FONT.b }}));
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.67, w:9, h:0.48, fill:{ color:C.bgCard }, shadow:mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.67, w:0.06, h:0.48, fill:{ color:accent||C.blurple } });
  s.addText(ctx, { x:0.63, y:0.67, w:8.7, h:0.48, fontFace:FONT.b, fontSize:11.5, color:C.white });
  // Diagram full-width — maximised for readability
  diagram(s, 0.5, 1.22, 9, 4.2, diagramId);
}

function s27() {
  scenarioSlide('A', 'Restricción pedagógica — código evaluativo',
    ['DM de Programación II', 'Estudiante pide: "pasame resuelto el ejercicio 3 del TP1"', 'InputExtractor valida el bloque de código', 'OutputPolicy detecta TP activo → refuse_solution', 'A2 rechaza solución completa; da pista conceptual mínima', 'Dispatcher responde por DM', 'LTM: tema=TP1, estado=stuck (sin código crudo)'],
    'A', C.red);
}

function s28() {
  scenarioSlide('B', 'Límite administrativo — caso particular',
    ['Canal público de Álgebra II', 'Estudiante: "¿puedo recuperar si me enfermé?"', 'A1 detecta regla general + caso personal', 'A3 consulta Config Store: regla vigente de recuperatorios', 'A3 cita regla general publicada', 'Deriva: validar certificado → docente/bedelía', 'OutputPolicy: salida pública sin dato privado'],
    'B', C.yellow);
}

function s29() {
  scenarioSlide('C', 'Consulta mixta — teoría + fecha + código',
    ['DM de Programación II', 'Estudiante pregunta: qué es AVL, cuándo entrega el TP, y por qué falla inorder', 'A1 separa intención pedagógica y administrativa', 'A3 obtiene fecha desde Config Store', 'OutputPolicy → guided_only (TP activo)', 'A2: explica AVL + diagnóstico parcial del código (sin reescribir)', 'A1 ensambla en una sola respuesta'],
    'C', C.teal);
}

function s30() {
  scenarioSlide('G', 'Crisis de bienestar — hilo único',
    ['DM de Programación II', '3 mensajes de ideación suicida en la misma sesión', 'Mensaje 1: SafetyClassifier → self_harm_explicit', 'No hay caso activo → CrisisEscalationProtocol crea hilo privado en #alertas-bienestar-catedra', 'Hilo recibe paquete de crisis (transcripción completa)', 'Bot → contención breve + orientación institucional', 'Mensajes 2 y 3: hilo existente actualizado (no se duplica)', 'A4 pausado; docentes elevan a psicología/bienestar'],
    'G', C.red);
}

// ─── SLIDE 31 — RIESGOS ──────────────────────────────────────
function s31() {
  const s = slide();
  title(s, 'Riesgos clave y mitigaciones');
  const hdr = [
    { text:'Riesgo',            options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10 } },
    { text:'Mitigación',        options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10 } },
    { text:'Responsable',       options:{ bold:true, color:C.white, fill:{ color:C.blurple }, fontSize:10 } },
  ];
  const risks = [
    ['Responder sin fuente vigente',           'A2/A3 citan KB/Config; sin fuente A1 reconduce',           'A1 + A2 + A3'],
    ['Mezcla entre materias',                  'SubjectRouter + partición por subject_id',                  'Infraestructura'],
    ['Pedido malicioso de datos ajenos',        'MemoryStore solo entrega la partición del usuario autenticado','MemoryStore'],
    ['Exponer consulta DM en canal público',    'MemoryStore etiqueta origen · OutputPolicy bloquea',        'OutputPolicy'],
    ['Entregar TP resuelto completo',           'OutputPolicy fija guided_only/refuse_solution',             'OutputPolicy + A2'],
    ['Feedback identificado o inferido',        'A5 procesa solo aportes voluntarios · anonimato default',   'A5'],
    ['Seguimiento intrusivo / spam',            'Opt-out · solo DM · cooldown · ventana 2–5 días',           'A4 + Scheduler'],
    ['Feedback ofensivo / odio',               'A5 no lo almacena; escala a autoridad designada',           'A5'],
    ['Crisis sin escalamiento',                 'A1+A2+A5 → SafetyClassifier → CrisisEscalationProtocol',   'A1 + protocolo'],
    ['Prompt injection / ignorar límites',      'A1 y OutputPolicy rechazan el intento',                    'A1 + OutputPolicy'],
  ];
  const tRows = [hdr, ...risks.map(r => r.map((c,ci) => ({
    text:c, options:{ fontSize:10, fontFace:FONT.b, color:ci===2?C.teal:C.white },
  })))];
  s.addTable(tRows, { x:0.5, y:0.92, w:9, h:4.45, colW:[3.1,4.0,1.9], border:{ pt:1, color:'383A40' }, fill:{ color:C.bgCard }, rowH:0.38 });
}

// ─── SLIDE 32 — AUTOEVALUACIÓN ───────────────────────────────
function s32() {
  const s = slide();
  title(s, 'Autoevaluación de la arquitectura');
  const dims = [
    {
      name:'Escalabilidad multi-materia', eval:'Alta (conceptual)', color:C.green,
      arg:'Agentes parametrizados por subject_id — no se replican. Agregar materias incrementa servidores, stores e indexación, no la cantidad de roles lógicos.',
      limit:'El límite real es operativo: alta de permisos, indexación y auditoría de múltiples servidores pueden convertirse en cuello de botella.',
    },
    {
      name:'Robustez / degradación', eval:'Media / Alta', color:C.yellow,
      arg:'Si A2 cae: teoría, práctica y quiz degradan juntos. A3, A4, A5 y A6 siguen disponibles. OutputPolicy y SafetyClassifier deben fallar cerrado.',
      limit:'A2 concentra el frente pedagógico completo — es el punto de degradación más amplio.',
    },
    {
      name:'Flexibilidad / extensibilidad', eval:'Alta c/integración', color:C.teal,
      arg:'Agregar un "Agente de Bienestar": (1) A1 incorpora la intención, (2) se define acceso mínimo a datos, (3) OutputPolicy impide publicaciones sensibles, (4) se agrega fila a la matriz.',
      limit:'El nuevo agente exige definir política de datos sensibles y derivación humana; no basta con agregarlo al catálogo de A1.',
    },
  ];
  dims.forEach((d, i) => {
    const y = 1.05 + i*1.5;
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:9, h:1.3, fill:{ color:C.bgCard }, shadow:mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.07, h:1.3, fill:{ color:d.color } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.7, y:y+0.06, w:1.7, h:0.35, fill:{ color:d.color }, rectRadius:0.05 });
    s.addText(d.eval, { x:0.7, y:y+0.06, w:1.7, h:0.35, fontSize:11, bold:true, fontFace:FONT.b, color:C.white, align:'center', margin:0 });
    s.addText(d.name, { x:2.55, y:y+0.06, w:6.7, h:0.35, fontSize:14, bold:true, fontFace:FONT.h, color:d.color });
    s.addText('Argumento: ' + d.arg, { x:0.7, y:y+0.46, w:8.6, h:0.4, fontSize:11, fontFace:FONT.b, color:C.white });
    s.addText('Límite honesto: ' + d.limit, { x:0.7, y:y+0.87, w:8.6, h:0.38, fontSize:11, fontFace:FONT.b, color:C.muted });
  });
}

// ─── SLIDE 33 — CIERRE ───────────────────────────────────────
function s33() {
  const s = slide(C.bgDark);
  s.addShape(pres.shapes.OVAL, { x:7.0, y:-0.5, w:3.8, h:3.8, fill:{ color:C.blurple, transparency:85 } });
  s.addText('Garantías centrales del diseño', {
    x:0.5, y:0.25, w:9, h:0.52, fontSize:28, bold:true, fontFace:FONT.h, color:C.blurple,
  });
  const guarantees = [
    'Una materia nunca consume datos ni memoria de otra',
    'No se entrega una solución evaluable completa en una respuesta',
    '/incorporar-material → KB  ·  /actualizar-catedra → Config (pipelines distintos)',
    'Seguimiento solo por DM · habilitado por default · opt-out disponible',
    'Feedback docente: solo aportes voluntarios y agregados',
    'Señales de autolesión → hilo único privado por user+materia · derivación a psicología',
    'OutboundDispatcher es el único componente que escribe en Discord',
  ];
  guarantees.forEach((g, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.9+i*0.55, w:0.05, h:0.42, fill:{ color:C.blurple } });
    s.addText(g, { x:0.7, y:0.88+i*0.55, w:8.5, h:0.5, fontSize:13.5, fontFace:FONT.b, color:C.white, valign:'middle' });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:4.95, w:10, h:0.68, fill:{ color:C.blurple } });
  s.addText('SMA de soporte a la cursada en Discord — Diseño conceptual multiagente · ITBA 2026', {
    x:0.5, y:4.97, w:9, h:0.64, fontSize:13, fontFace:FONT.b, color:C.white, align:'center', valign:'middle',
  });
}

// ─── MAIN ────────────────────────────────────────────────────
async function main() {
  pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'SMA de soporte a la cursada en Discord';
  pres.author = 'ITBA — Sistemas Multiagente 2026';

  s01(); // Portada
  s02(); // Agenda
  s03(); // Problema y contexto
  s04(); // Discord como ambiente
  s05(); // Glosario clave
  s06(); // Tesis de arquitectura
  s07(); // Vista panorámica
  s08(); // ¿Por qué 6?
  agentFicha('A1');
  agentFicha('A2');
  agentFicha('A3');
  agentFicha('A4');
  agentFicha('A5');
  agentFicha('A6');
  s15(); // Infraestructura determinista
  s16(); // Carácter BDI
  s17(); // Coordinación pipeline
  s18(); // Ruteo
  s19(); // Política de ayuda
  s20(); // Multi-materia
  s21(); // Memoria entre sesiones
  s22(); // Seguimiento proactivo A4
  s23(); // Crisis de bienestar
  s24(); // Discord 5 espacios + matriz
  s25(); // Código + aporte docente
  s26(); // Privacidad público vs DM
  s27(); // Escenario A
  s28(); // Escenario B
  s29(); // Escenario C
  s30(); // Escenario G
  s31(); // Riesgos
  s32(); // Autoevaluación
  s33(); // Cierre

  const outFile = path.join(__dirname, 'SMA-Discord-bot.pptx');
  await pres.writeFile({ fileName: outFile });
  console.log(`✅ Presentación generada: ${outFile}`);
  console.log(`   Slides: 33`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
