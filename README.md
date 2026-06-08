# Portfolio Structure

## Folder Guide

- `index.html`: 전체 페이지 섹션 구조와 SEO 메타 태그
- `css/reset.css`: 브라우저 기본 스타일 초기화
- `css/common.css`: 공통 변수, 컨테이너, 버튼, 섹션 스타일
- `css/style.css`: 페이지별 레이아웃과 반응형 스타일
- `js/data.js`: WORK, PROJECT, SKILL 데이터 관리
- `js/components.js`: 데이터 기반 카드 렌더링
- `js/main.js`: 메뉴, 스크롤, AOS, GSAP 인터랙션
- `images/about`: 프로필, 소개 영역 이미지
- `images/work`: 실무 작업 썸네일
- `images/project`: 개인 프로젝트 썸네일
- `images/common`: 공유 이미지, 공통 이미지
- `images/favicon`: 파비콘

## Edit Tips

작업이나 프로젝트를 추가할 때는 `index.html`을 반복 수정하지 않고 `js/data.js`의 배열에 항목을 추가하세요.

이미지 파일명은 데이터의 `image` 경로와 맞춰 넣으면 자동으로 연결됩니다. 아직 이미지가 없으면 임시 썸네일이 표시됩니다.
