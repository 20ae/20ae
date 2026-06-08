(function () {
  const data = window.PORTFOLIO_DATA;

  if (!data) {
    return;
  }

  const createPlaceholder = (title) => {
    const encodedTitle = encodeURIComponent(title);
    return `https://placehold.co/900x560/f0eefc/6d5dfc?text=${encodedTitle}`;
  };

  const renderSkills = () => {
    const track = document.querySelector("[data-skill-track]");

    if (!track) {
      return;
    }

    const skills = [...data.skills, ...data.skills];
    track.innerHTML = skills.map((skill) => `<span class="skill-chip">${skill}</span>`).join("");
  };

  const renderWorks = () => {
    const list = document.querySelector("[data-work-list]");

    if (!list) {
      return;
    }

    list.innerHTML = data.works
      .map(
        (work) => `
          <li class="work-card" data-aos="fade-up">
            <a href="${work.url}" target="_blank" rel="noreferrer">
              <figure class="work-card__thumb">
                <img src="${work.image}" alt="${work.alt}" onerror="this.src='${createPlaceholder(work.title)}'">
              </figure>
              <div class="work-card__body">
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
