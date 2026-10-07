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
  v: 2, demoV: 2, seeded: true, samplePurged: true, snipVars: false, unlock: {}, notes: [], customWorks: [], myEval: {},
  settings: { spoiler: true, activeRun: 'demo_run' },
  snippets: [
    { id: 'sn1', title: '상황 정리 요청', text: '(OOC: 지금까지의 진행 상황을 인물·장소·목표 순서로 짧게 정리해줘)' },
    { id: 'sn2', title: '상태창 다시 보기', text: '(OOC: 현재 상태창을 다시 출력해줘)' },
    { id: 'sn3', title: '시간 넘기기', text: '(시간이 흘러 다음 날 아침이 되었다.)' },
    { id: 'sn4', title: '답변 짧게', text: '(OOC: 다음 답변은 대사 위주로 조금 짧게 써줘)' }
  ],
  profiles: [{ id: 'demo_p', name: '한별', summary: '퇴근 후 일레온에 접속하는 스물여섯 살 회사원', appearance: '짧은 갈색 머리, 낡은 초보자 망토', personality: '호기심이 많고 손해 보는 걸 싫어함', background: '', speech: '존댓말, 당황하면 말끝을 흐림', memo: '', crack: '', img: '', created: t(9) }],
  runs: [{
    id: 'demo_run', profileId: 'demo_p', workId: 'ileon', title: '뉴비 루트 · 첫 접속', status: '진행중', cover: '', created: t(9), updated: t(0),
    fields: { mode: '뉴비', level: 12, cls: '견습 검사', grade: '일반', region: '리아텔', incident: '', pod: '보급형', asset: '' },
    met: ['L', 'K', 'A'], rel: { L: '호감', K: '중립', A: '처음 만남' }, affinity: { L: 2, K: 1, A: 1 },
    state: { place: '리아텔 외곽 숲', time: '접속 6일째 밤' },
    pins: [{ id: 'pn1', text: '셀리아에게 정보값 300골드를 빚졌다' }, { id: 'pn2', text: '줄리엣은 파랑스 길드 소속이라는 소문' }],
    threads: [], timeline: [], items: [], stats: [], lore: [], gallery: [], noteIds: [], memoImgs: [], events: [], endings: [], myEvents: [], cmemo: {}, address: {}, memo: '', link: ''
  }],
  entries: [
    { id: 'demo_e1', runId: 'demo_run', date: day(8), created: t(8), rating: 4, title: '귀환석 광장의 첫 접속', when: '접속 1일째', place: '리아텔 귀환석 광장', mood: '설렘',
      summary: '풀다이브 포드에 처음 누웠다. 견습 기사 유안이 튜토리얼을 맡아 주었다.', events: '튜토리얼', choice: '직업으로 검사를 골랐다', chars: ['L'], delta: { L: 2 }, scenes: [{ who: '유안', text: '이방인님, 귀환석에 손을 얹어 주세요!' }], gain: '초보자 장검', next: '첫 사냥 퀘스트 받기', tags: ['유안'], imgs: [] },
    { id: 'demo_e2', runId: 'demo_run', date: day(4), created: t(4), rating: 4, title: '카뎃트의 정보상', when: '접속 4일째', place: '자유도시 카뎃트', mood: '긴장',
      summary: '숨은 퀘스트 소문을 듣고 셀리아를 찾아갔다. 정보값이 모자라 외상을 달았다.', events: '', choice: '빚을 지고 정보를 샀다', chars: ['K'], delta: { K: 1 }, scenes: [{ who: '셀리아', text: '손님, 정보는 선불이에요. 이번만 외상으로 해 드릴게요.' }], gain: '잿빛 회랑 지도 조각', next: '지도 조각 나머지 찾기', tags: ['셀리아'], imgs: [] },
    { id: 'demo_e3', runId: 'demo_run', date: day(0), created: t(0), rating: 5, title: '랭킹 1위와 마주치다', when: '접속 6일째 밤', place: '리아텔 외곽 숲', mood: '얼떨떨',
      summary: '몬스터 무리에 몰린 순간 줄리엣이 한 번에 정리하고 지나갔다. 말을 걸었지만 대답은 짧았다.', events: '', choice: '줄리엣을 따라가 말을 걸었다', chars: ['A'], delta: { A: 1 }, scenes: [{ who: '줄리엣', text: '그쪽, 거기 서 있으면 죽어요.' }], gain: '레벨 12 달성', next: '줄리엣이 향한 하르덴 쪽 길 알아보기', tags: ['줄리엣'], imgs: [] }
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
// 저장된 기록이 없거나, 예전 버전의 예시 기록 그대로면 새 예시로 바꿔요. 방문자가 만든 기록은 건드리지 않아요.
html = html.replace(boot, 'const d0 = await Store.load(), DM = window.__MOON_DEMO__; const d = !d0 || (DM && (d0.runs || []).some(r => r.id === "demo_run") && d0.demoV !== DM.demoV) ? DM : d0;');
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">\n' + inject);

// 최신작을 맨 앞에: 작품 목록과 BGM 목록에서 FEATURED 작품을 앞으로 옮겨요.
const FEATURED = 'ileon';
{
  const a = html.indexOf('const WORKS = '), b = html.indexOf('];', a);
  if (a < 0 || b < 0) throw new Error('WORKS 목록을 찾지 못했어요');
  const works = JSON.parse(html.slice(a + 14, b + 1));
  const i = works.findIndex(w => w.id === FEATURED);
  if (i < 0) throw new Error(FEATURED + ' 작품이 WORKS에 없어요');
  works.unshift(works.splice(i, 1)[0]);
  html = html.slice(0, a + 14) + JSON.stringify(works) + html.slice(b + 1);
  const c = html.indexOf('const BGM = ['), d = html.indexOf('\n];', c);
  if (c < 0 || d < 0) throw new Error('BGM 목록을 찾지 못했어요');
  const lines = html.slice(c, d).split('\n').map((l, i) => i && l.trim() && !l.trimEnd().endsWith(',') ? l.trimEnd() + ',' : l), head = lines.shift();
  const mine = lines.filter(l => l.includes("work: '" + FEATURED + "'"));
  html = html.slice(0, c) + [head, ...mine, ...lines.filter(l => !mine.includes(l))].join('\n') + html.slice(d);
}

fs.writeFileSync(path.join(out, 'index.html'), html);
for (const dir of ['img', 'media']) fs.cpSync(path.join(src, dir), path.join(out, dir), { recursive: true });
const ver = (html.match(/APP_VERSION = '([^']+)'/) || [])[1];
console.log(`app/ 체험판을 만들었어요 (앱 v${ver})`);
