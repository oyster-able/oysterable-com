# Oysterable.com

오이스터에이블 회사 홈페이지. 시안 C-v3 (Cinematic) — Next.js 16 (App Router) + 정적 export.

## 톤
- **Reduce. Collect. Trace.** — AI · IoT · 도시의 순환경제
- 다크모드 + 풀블리드 시네마틱 + 한/영 토글

## 개발
```bash
npm install
npm run dev   # http://localhost:3000
npm run build # → out/ 정적 빌드
```

## 배포
- 정적 export (`next.config.ts: output: "export"`)
- AWS Amplify Hosting → `out/` 정적 호스팅
- 도메인: `oysterable.com` (Route53 → Amplify CloudFront)

## 구조
```
app/
  layout.tsx     루트 레이아웃 + Pretendard CDN
  page.tsx       전체 페이지 (Hero/Service/Tech/Numbers/Cases/Recognition/Partners/SmartCity/Contact)
  globals.css    시안 CSS (다크모드 + 시네마틱)
lib/
  i18n.ts        한/영 메시지 dictionary
public/site/     이미지 슬롯 (외부 발주 후 동일 파일명으로 교체)
```

## 이미지 발주 명세
옵시디언: `Oysterable.com 이미지 발주 명세서 (2026-04-30).md`

22~26장 + 로고. 우선순위 Critical(4) / High(10) / Nice-to-have(8) 분류.

## 카피 출처
옵시디언: `Oysterable 홈페이지 카피 초안 v5.md`
