export const PORTFOLIO_DATA = {
  skills: [
    {
      name: "React",
      icon: "images/icon/react.png",
      iconType: "image",
      description:
        "컴포넌트 기반으로 UI를 구현하고, props와 state를 활용해 재사용 가능한 인터페이스를 제작합니다. useEffect, 조건부 렌더링, 리스트 렌더링을 활용해 동적인 화면과 사용자 인터랙션을 구현합니다.",
    },
    {
      name: "HTML5",
      icon: "images/icon/html5.png",
      iconType: "image",
      description:
        "시맨틱 태그를 활용해 웹 표준에 맞는 마크업을 작성하고, form 요소와 접근성 속성을 고려한 구조를 구현합니다.",
    },
    {
      name: "CSS3",
      icon: "images/icon/css3.png",
      iconType: "image",
      description:
        "Flexbox와 Grid를 활용해 반응형 레이아웃을 구성하고, 미디어 쿼리로 디바이스별 UI를 대응합니다. transition, transform, 커스텀 속성을 활용해 인터랙션과 일관된 디자인 시스템을 구현할 수 있습니다.",
    },
    {
      name: "JavaScript",
      icon: "fa-brands fa-js",
      iconType: "font",
      description:
        "DOM 조작과 이벤트 핸들링을 통해 사용자 인터랙션을 구현하며, 비동기 처리와 배열·객체 메서드를 활용해 동적인 기능을 개발합니다.",
    },
    {
      name: "TypeScript",
      icon: "images/icon/typeScript.png",
      iconType: "image",
      description:
        "기본적인 타입과 interface를 활용해 데이터 구조를 정의하고, 컴포넌트 props와 함수에 타입을 적용해 보다 안정적인 코드를 작성합니다.",
    },
    {
      name: "Illustrator",
      icon: "images/icon/ai.png",
      iconType: "image",
      description:
        "웹 작업에 필요한 에셋을 SVG·PNG 형식으로 내보내 퍼블리싱과 프론트엔드 작업에 활용합니다.",
    },
    {
      name: "GitHub",
      icon: "fa-brands fa-github",
      iconType: "font",
      description:
        "Git을 활용해 커밋, 브랜치, 병합 흐름을 관리하고 GitHub로 원격 저장소를 운영합니다. Pull Request와 이슈 기반으로 협업하며 변경 이력을 체계적으로 관리할 수 있습니다.",
    },
    {
      name: "SVN",
      icon: "fa-solid fa-code-branch",
      iconType: "font",
      description:
        "SVN을 활용해 중앙 저장소 기반의 버전 관리와 협업을 진행합니다. checkout, update, commit 흐름을 통해 팀 단위 프로젝트의 소스 동기화와 변경 이력 관리가 가능합니다.",
    },
  ],
  works: [
    {
      title: "필그림스센터 홈페이지 개발",
      category: "Web | 퍼블리싱 · 프론트엔드 · React · 반응형",
      image: "images/project/project_pilgrims.png",
      alt: "필그림스센터 홈페이지 썸네일",
      description:
        "교육 플랫폼 필그림스센터의 메인 홈페이지를 React 기반으로 개발했습니다. 프로그램 소개, 글 포스팅, 게시판 등 주요 콘텐츠를 컴포넌트 기반으로 구현했으며, 반응형 레이아웃을 적용해 다양한 디바이스에서 일관된 사용자 경험을 제공했습니다.",
      year: "2025",
      imageCaption: "Pilgrims Center homepage",
      visitUrl: "https://www.pilgrimscenter.org",
      detailUrl: "https://app.notion.com/p/373633f7caaa80e1aabae925d1cc7689?source=copy_link",
      roles: [
        "메인 페이지 퍼블리싱",
        "React 컴포넌트 개발",
        "반응형 UI 구현",
        "프론트엔드 유지보수",
      ],
      tech: ["React", "TypeScript", "CSS", "Tailwind CSS", "Git"],
      features: [
        "반응형 레이아웃",
        "글 포스팅 기능",
        "검색 기능",
        "로그인/회원가입 기능",
      ],
    },
    {
      title: "솜씨게임 마녀의 성 콘텐츠 개발",
      category: "Web | 퍼블리싱 · 프론트엔드 · 인터랙티브 콘텐츠",
      image: "images/project/project_somseeGame.png",
      alt: "마녀의 성 썸네일",
      description:
        "솜씨게임 플랫폼의 OX 퀴즈형 인터랙티브 학습 콘텐츠 '마녀의 성'을 개발했습니다. HTML, CSS, JavaScript를 활용해 사용자 인터랙션과 정답·오답 피드백 애니메이션을 구현하고, 학습 흐름에 맞는 화면을 구성했습니다.",
      year: "2025",
      imageCaption: "Interactive learning content",
      visitUrl:
        "https://somsee.co.kr/ebook_viewer/index.html?contentUrl=/live_nas/live_resource/ebook/Contents/ca88a70d-6228-4186-a56f-a6082f09bebc&page=1",
      previewUrl:
        "https://somsee.co.kr/ebook_viewer/index.html?contentUrl=/live_nas/live_resource/ebook/Contents/ca88a70d-6228-4186-a56f-a6082f09bebc&page=1",
      detailUrl: "https://app.notion.com/p/373633f7caaa806b984dd3855e6e63c4?source=copy_link",
      roles: [
        "인터랙티브 콘텐츠 퍼블리싱",
        "JavaScript 인터랙션 개발",
        "콘텐츠 흐름 및 애니메이션 적용",
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "SVN"],
      features: [
        "OX 퀴즈 인터랙션",
        "문제 및 결과 화면 구현",
        "애니메이션 피드백",
      ],
    },
    {
      title: "수학콕콕 콘텐츠 개발",
      category: "Web | 퍼블리싱 · 프론트엔드 · 인터랙티브 콘텐츠",
      image: "images/project/project_mathkok.png",
      alt: "수학콕콕 썸네일",
      description:
        "수학 학습 콘텐츠 '수학콕콕'의 화면 퍼블리싱과 인터랙션 개발을 담당했습니다. HTML, CSS, JavaScript를 활용해 OX 퀴즈, 클릭 퀴즈, 드래그앤드롭 등 다양한 문제 유형을 구현하고, 정답·오답 피드백을 통해 자연스러운 학습 경험을 제공했습니다",
      year: "2025",
      imageCaption: "Math learning interactive UI",
      visitUrl:
        "https://somsee.co.kr/ebook_viewer/index.html?contentUrl=/live_nas/live_resource/ebook/Contents/030c80c5-5a74-4655-be09-e81721a7f70e&page=1",
      previewUrl:
        "https://somsee.co.kr/ebook_viewer/index.html?contentUrl=/live_nas/live_resource/ebook/Contents/030c80c5-5a74-4655-be09-e81721a7f70e&page=1",
      detailUrl: "https://app.notion.com/p/373633f7caaa80aa9c2af1a7f8e78aa8?source=copy_link",
      roles: [
        "수학 학습 화면 퍼블리싱",
        "문제 풀이 UI 구현",
        "JavaScript 인터랙션 개발",
        "정답·오답 피드백 구현",
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "SVN"],
      features: [
        "OX 퀴즈 인터랙션",
        "클릭형 퀴즈 구현",
        "드래그앤드롭 인터랙션",
        "정답·오답 피드백 UI",
      ],
    },
    {
      title: "금성출판사 음미체실 콘텐츠 개발",
      category: "Web | 퍼블리싱 · 프론트엔드 · 교육 콘텐츠",
      image: "images/project/project_magp.png",
      alt: "금성출판사 음미체실 썸네일",
      description:
        "금성출판사 교육 콘텐츠 '음미체실'의 웹 화면을 개발했습니다. HTML, CSS, JavaScript를 활용해 음악·미술·체육·실과 교과 콘텐츠의 UI를 구현하고, 클릭 이벤트와 애니메이션 인터랙션, 미디어 콘텐츠 재생 기능을 적용해 학습 활동에 맞는 화면을 구성했습니다.",
      year: "2024",
      imageCaption: "Educational classroom content",
      detailUrl: "https://app.notion.com/p/373633f7caaa804fa717e292764e31a0?source=copy_link",
      roles: [
        "교육 콘텐츠 퍼블리싱",
        "교과 학습 화면 UI 구현",
        "JavaScript 인터랙션 개발",
        "미디어 콘텐츠 연동",
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "SVN"],
      features: [
        "클릭 기반 학습 인터랙션",
        "정답 확인 및 피드백 UI",
        "미디어 콘텐츠 재생",
        "애니메이션 인터랙션",
      ],
    },
    {
      title: "금성출판사 아이스쿨 콘텐츠 개발",
      category: "Web | 퍼블리싱 · 프론트엔드 · 인터랙티브 콘텐츠",
      image: "images/project/project_ischool.png",
      alt: "금성출판사 아이스쿨 썸네일",
      description:
        "금성출판사 '아이스쿨' 인터랙티브 학습 콘텐츠의 UI를 개발했습니다. HTML, CSS, JavaScript를 활용해 애니메이션 기반 학습 화면과 다양한 퀴즈 인터랙션을 구현했으며, 터치·클릭 이벤트를 적용해 직관적인 학습 경험을 제공했습니다.",
      year: "2024",
      imageCaption: "Interactive school content",
      detailUrl: "https://app.notion.com/p/373633f7caaa802f946ce48d7d32fb43?source=copy_link",
      videoUrls: [
        "images/project/mp4/ischool_01.mp4",
        "images/project/mp4/ischool_02.mp4",
        "images/project/mp4/ischool_03.mp4",
        "images/project/mp4/ischool_04.mp4",
      ],
      roles: [
        "인터랙티브 콘텐츠 퍼블리싱",
        "퀴즈형 학습 UI 구현",
        "JavaScript 인터랙션 개발",
        "애니메이션 효과 적용",
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "SVN"],
      features: [
        "퀴즈형 학습 인터랙션",
        "터치·클릭 이벤트 처리",
        "애니메이션 기반 피드백",
        "미디어 콘텐츠 연동",
      ],
    },
    {
      title: "동아출판사 실과 콘텐츠 개발",
      category: "Web | 퍼블리싱 · 프론트엔드 · 교육 콘텐츠",
      image: "images/project/project_practice.png",
      alt: "동아출판사 실과 썸네일",
      description:
        "동아출판사 실과 교과 콘텐츠의 웹 퍼블리싱과 인터랙션 개발을 담당했습니다. HTML, CSS, JavaScript를 활용해 활동지 형태의 학습 화면을 구현하고, 클릭 이벤트와 미디어 콘텐츠, 애니메이션 인터랙션을 적용해 학습 흐름에 맞는 UI를 구성했습니다.",
      year: "2024",
      imageCaption: "Practical arts education content",
      detailUrl: "https://app.notion.com/p/373633f7caaa809ca9f3eb3b70c5f492?source=copy_link",
      roles: [
        "실과 교과 콘텐츠 퍼블리싱",
        "학습 화면 UI 구현",
        "JavaScript 인터랙션 개발",
        "미디어 콘텐츠 및 애니메이션 적용",
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "SVN"],
      features: [
        "클릭 기반 학습 인터랙션",
        "미디어 콘텐츠 재생",
        "애니메이션 인터랙션",
      ],
    },
    {
      title: "금성 노래익히기 UI",
      category: "Web | 퍼블리싱 · 프론트엔드 · UI/UX · 유지보수",
      image: "images/project/project_music.png",
      alt: "금성 노래익히기 UI 썸네일",
      description:
        "금성출판사 '노래익히기' 학습 UI의 화면 개선과 유지보수를 담당했습니다. 재생 컨트롤, 가사 영역, 학습 단계 표시 등 사용성을 중심으로 인터페이스를 정비했습니다.",
      year: "2024",
      imageCaption: "Music learning interface",
      detailUrl: "https://app.notion.com/p/UI-373633f7caaa80c6a854e7499b2706e9?source=copy_link",
      videoUrls: ["images/project/mp4/kumsung.mp4"],
      roles: [
        "노래익히기 UI 개선",
        "재생 컨트롤 화면 정비",
        "사용성 중심 유지보수",
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "SVN"],
      features: [
        "음악 재생 컨트롤",
        "가사 표시 영역",
        "사용성 개선 UI",
      ],
    },
  ],
};
