# Vercel 배포 가이드 (GitHub 연동)

이 프로젝트는 모노레포 구조이며, Vercel에서 **Expo(Web) 정적 export 결과물**을 배포합니다.

---

## 1) 사전 확인

- **빌드 명령**: `yarn vercel:build`
  - 내부적으로 `packages/zuix`를 빌드한 뒤 `apps/zikim-rn`에서 `expo export --platform web`을 수행합니다.
- **배포 산출물 디렉토리**: `apps/zikim-rn/dist`
- **Vercel 설정 파일**: 루트 `vercel.json` 참고

---

## 2) GitHub에 올리기

이미 원격 저장소가 있다면 생략하고 push만 하면 됩니다.

```bash
git init
git add .
git commit -m "feat: diagnosis flow + report charts"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

---

## 3) Vercel 프로젝트 생성/연결

- Vercel → **Add New... → Project**
- GitHub 저장소 선택 후 Import
- **Root Directory**: 저장소 루트(기본값) 유지
- 설정은 `vercel.json`이 자동으로 적용됩니다.

### (참고) 현재 `vercel.json` 설정

- **installCommand**: `yarn install --production=false`
- **buildCommand**: `yarn vercel:build`
- **outputDirectory**: `apps/zikim-rn/dist`
- **SPA 라우팅**을 위해 모든 경로를 `/index.html`로 rewrite

---

## 4) 배포 확인

배포가 성공하면 Vercel이 Preview/Production URL을 제공합니다.

- **Preview**: PR/브랜치 기준 자동 생성
- **Production**: main(또는 지정 브랜치) merge 시 자동 배포

---

## 5) 문제 해결(자주 겪는 것)

- **라우팅이 새로고침에서 404**:
  - `vercel.json`의 `rewrites`가 필요합니다(현재 설정됨).
- **빌드 중 ZUIX(패키지) 빌드가 실패**:
  - `packages/zuix`의 rollup/babel 의존성 설치가 필요합니다.
  - Vercel은 fresh install을 수행하므로, 로컬에서도 동일하게 `yarn install` 후 재시도하세요.

