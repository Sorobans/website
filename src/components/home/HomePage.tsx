import '@fortawesome/fontawesome-free/css/all.min.css';
import { homePageLinks, homePageProfile } from '../../config/homePageConfig';

const HomePage = () => {
  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br">
      <div className="absolute inset-0">
        <div
          className="fixed inset-0 h-screen w-screen bg-cover bg-center bg-fixed opacity-70"
          style={{ backgroundImage: `url('${homePageProfile.backgroundUrl}')` }}
        />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[860px] flex-col px-5">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full rounded-[20px] border-2 border-pink-light bg-gradient-to-br from-white/95 to-pink-soft/95 p-6 shadow-pink-card backdrop-blur-md sm:p-10">
            <div className="flex justify-center">
              <div className="relative mb-6 h-[150px] w-[150px] rounded-full border-4 border-pink-border shadow-pink-avatar">
                <img
                  src={homePageProfile.avatarUrl}
                  alt={homePageProfile.avatarAlt}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <h1
              className="text-[2.5rem] font-bold tracking-[1px] text-pink-main"
              style={{ textShadow: '2px 2px 8px rgba(255,105,180,0.3)' }}
            >
              {homePageProfile.name}
            </h1>
              <p className="mx-auto mt-3 max-w-[560px] px-5 text-[1.1rem] italic text-[#666]">
                {homePageProfile.tagline}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                className="flex min-w-[200px] items-center justify-center gap-2 rounded-[25px] bg-gradient-to-r from-[#24292e] to-[#1f2327] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(36,41,46,0.3)] transition hover:-translate-y-0.5"
                href={homePageLinks.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-github text-base" aria-hidden="true" />
                GitHub
              </a>
              <a
                className="flex min-w-[200px] items-center justify-center gap-2 rounded-[25px] bg-gradient-to-r from-[#ff7aa2] to-[#ff4f87] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(255,79,135,0.3)] transition hover:-translate-y-0.5"
                href="/blog"
              >
                <i className="fa-solid fa-pen-nib text-base" aria-hidden="true" />
                进入博客
              </a>
            </div>
          </div>
        </div>

        <footer className="pb-6 text-center text-sm text-pink-main">
          {homePageProfile.footerText}
        </footer>
      </div>
    </section>
  );
};

export default HomePage;
