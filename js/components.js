(function () {
  const data = window.PORTFOLIO_DATA;

  if (!data) {
    return;
  }

  const createPlaceholder = (title) => {
    const encodedTitle = encodeURIComponent(title);
    return `https://placehold.co/900x560/f0eefc/6d5dfc?text=${encodedTitle}`;
  };

  const toClassName = (value) => {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");
  };

  const renderSkills = () => {
    const track = document.querySelector(".skills_track");

    if (!track) {
      return;
    }

    const skills = [...data.skills, ...data.skills];
    track.innerHTML = skills
      .map((skill) => {
        let iconHtml;
        if (skill.iconType === "image") {
          iconHtml = `<img src="${skill.icon}" alt="${skill.name}" class="skills_icon">`;
        } else {
          iconHtml = `<i class="${skill.icon}" aria-hidden="true"></i>`;
        }
        return `<span class="skills_item skills_item_${toClassName(skill.name)}" aria-label="${skill.name}">${iconHtml}</span>`;
      })
      .join("");
  };

  const renderWorks = () => {
    const list = document.querySelector(".works_grid");

    if (!list) {
      return;
    }

    list.innerHTML = data.works
      .map(
        (work) => `
          <li class="work-card">
            <a href="${work.url}" target="_blank" rel="noreferrer">
              <figure class="work-card_thumb">
                <img src="${work.image}" alt="${work.alt}" onerror="this.src='${createPlaceholder(work.title)}'">
              </figure>
              <div class="work-card_body">
                <h3>${work.title}</h3>
                <p>${work.category}</p>
              </div>
            </a>
          </li>
        `
      )
      .join("");
  };

  renderSkills();
  renderWorks();
})();
