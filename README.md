# MOON 배포 사이트

- 사이트: GitHub Pages (공개 저장소 `moooncang/moon`, `main` 브랜치 루트)
- 설치 파일: 같은 저장소의 GitHub Releases (태그 `v<버전>`)
- 사이트 저장소에는 설치 파일을 넣지 않아요. `signing/` 등 다른 폴더도 절대 넣지 않아요.

## 새 버전 올리기
1. `builds/`에 새 파일이 들어왔는지 확인 (`MOON-<버전>.apk`, `MOON-<버전>-win-x64.exe`, `MOON-<버전>-mac-universal.dmg`)
2. 릴리스 만들고 파일 올리기
   ```
   gh release create v<버전> -R moooncang/moon --title "MOON <버전>" --notes "변경 내용" ^
     ..\builds\MOON-<버전>.apk ..\builds\MOON-<버전>-win-x64.exe ..\builds\MOON-<버전>-mac-universal.dmg
   ```
3. `release.js`의 `version`, `date`, 파일 `name`·`size`(바이트) 수정, `changes` 맨 위에 새 항목 추가
   - 크기 확인: PowerShell `(Get-Item ..\builds\MOON-<버전>.apk).Length`
4. `git add -A; git commit -m "v<버전>"; git push` → 1~2분 뒤 사이트 반영

## 체험판(app/) 새로 만들기
앱 화면(`../web`)이 바뀌면 이 폴더에서 `node sync-app.mjs` 를 실행하세요. `../web`을 읽어 `app/`에 복사하고, 처음 여는 사람에게 예시 기록을 넣어 줘요. (`../web`은 수정하지 않아요. 체험판은 음원 포함 약 118MB)

## 파일
- `index.html` — 사이트 본체 (앱 디자인 토큰 그대로)
- `release.js` — 버전·파일·변경 내역 (새 버전 때 여기만 수정)
- `img/` — 아이콘, 공유 미리보기(og.jpg)
- `app/` — 사이트 안에서 직접 눌러 보는 체험판 (sync-app.mjs가 생성)
- `sync-app.mjs` — 체험판 생성 스크립트
