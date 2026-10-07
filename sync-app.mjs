// 체험용 앱 만들기: ../web 을 읽어서 ./app 에 복사하고, 처음 여는 사람에게 예시 기록을 넣어 줍니다.
// 앱 화면이 바뀌면 이 폴더에서  node sync-app.mjs  를 한 번 실행하세요. (../web 은 읽기만 해요)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, '..', 'web');
const out = path.join(here, 'app');

const day = n => { const d = new Date(Date.now() - n * 864e5); return d.toISOString().slice(0, 10); };
const t = n => Date.now() - n * 864e5;

const DEMO = {
  v: 2, seeded: true, samplePurged: true, snipVars: false, unlock: {}, notes: [], customWorks: [], myEval: {},
  settings: { spoiler: true, activeRun: 'demo_run' },
  snippets: [
    { id: 'sn1', title: '상황 정리 요청', text: '(OOC: 지금까지의 진행 상황을 인물·장소·목표 순서로 짧게 정리해줘)' },
    { id: 'sn2', title: '상태창 다시 보기', text: '(OOC: 현재 상태창을 다시 출력해줘)' },
    { id: 'sn3', title: '시간 넘기기', text: '(시간이 흘러 다음 날 아침이 되었다.)' },
    { id: 'sn4', title: '답변 짧게', text: '(OOC: 다음 답변은 대사 위주로 조금 짧게 써줘)' }
  ],
  profiles: [{ id: 'demo_p', name: '서하온', summary: '폐허가 된 서울에서 살아남은 스물두 살 대학생', appearance: '짧은 흑발, 낡은 바람막이', personality: '겁이 많지만 한번 정하면 물러서지 않음', background: '', speech: '존댓말, 긴장하면 말이 빨라짐', memo: '', crack: '', img: '', created: t(9) }],
  runs: [{
    id: 'demo_run', profileId: 'demo_p', workId: 'tamer', title: '부랑자 루트 · 첫 계약', status: '진행중', cover: '', created: t(9), updated: t(0),
    fields: { mode: '부랑자', faction: '부랑자', partner: '볼트', line: '퓨즈', stage: 3 },
    met: ['A', 'C', 'G'], rel: { A: '호감', C: '경계', G: '신뢰' }, affinity: { A: 2, C: -1, G: 3 },
    state: { place: '구 잠실 지하 정거장', time: '붕괴 후 41일째 밤' },
    pins: [{ id: 'pn1', text: '볼트는 비 오는 날 전기가 약해진다' }, { id: 'pn2', text: '카일에게 지하 지도의 출처를 아직 말하지 않았다' }],
    threads: [], timeline: [], items: [], stats: [], lore: [], gallery: [], noteIds: [], memoImgs: [], events: [], endings: [], myEvents: [], cmemo: {}, address: {}, memo: '', link: ''
  }],
  entries: [
    { id: 'demo_e1', runId: 'demo_run', date: day(8), created: t(8), rating: 4, title: '번개 고양이와의 계약', when: '붕괴 후 34일째', place: '무너진 편의점', mood: '긴장',
      summary: '굶주린 크리처에게 마지막 통조림을 내밀었다가 계약이 맺어졌다. 이름은 볼트.', events: '첫 계약', choice: '도망치지 않고 먹이를 나눴다', chars: [], delta: {}, scenes: [{ who: '볼트', text: '…찌릿.' }], gain: '파트너 볼트', next: '물과 건전지 구하기', tags: ['첫계약'], imgs: [] },
    { id: 'demo_e2', runId: 'demo_run', date: day(4), created: t(4), rating: 5, title: '레아의 진료소', when: '붕괴 후 38일째', place: '성수동 임시 진료소', mood: '안도',
      summary: '볼트가 다쳐 레아를 찾아갔다. 치료비 대신 약품 운반을 맡기로 했다.', events: '', choice: '레아의 부탁을 받아들였다', chars: ['G'], delta: { G: 2 }, scenes: [{ who: '레아', text: '다음엔 다치기 전에 와요.' }], gain: '진통제 2개', next: '약품 상자를 잠실까지 옮기기', tags: ['레아'], imgs: [] },
    { id: 'demo_e3', runId: 'demo_run', date: day(0), created: t(0), rating: 4, title: '지하 정거장의 거래', when: '붕괴 후 41일째 밤', place: '구 잠실 지하 정거장', mood: '경계',
      summary: '카일이 지하 지도를 넘기는 대가로 볼트를 노렸다. 이설린이 끼어들어 거래가 미뤄졌다.', events: '', choice: '볼트를 넘기지 않았다', chars: ['A', 'C'], delta: { A: 2, C: -1 }, scenes: [{ who: '카일', text: '그 고양이, 생각보다 비싸게 팔릴 텐데.' }, { who: '이설린', text: '거래는 내일 해. 오늘은 내가 먼저 왔으니까.' }], gain: '지하 지도 일부', next: '이설린에게 거래 조건 묻기', tags: ['카일', '이설린'], imgs: [] }
  ]
};

const inject = `<script>
/* 사이트 체험판: 저장된 기록이 없을 때만 예시 기록으로 시작해요. 기록은 이 브라우저에만 남아요. */
window.__MOON_DEMO__ = ${JSON.stringify(DEMO)};
</script>`;

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const boot = 'const d = await Store.load();';
if (!html.includes(boot)) throw new Error('앱의 시작 코드가 바뀌었어요: sync-app.mjs의 boot 문자열을 확인하세요');
html = html.replace(boot, 'const d = (await Store.load()) || window.__MOON_DEMO__ || null;');
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">\n' + inject);
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const dir of ['img', 'media']) fs.cpSync(path.join(src, dir), path.join(out, dir), { recursive: true });
const ver = (html.match(/APP_VERSION = '([^']+)'/) || [])[1];
console.log(`app/ 체험판을 만들었어요 (앱 v${ver})`);
