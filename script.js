(function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [];
  let currentActive = 'overview';

  navLinks.forEach(link => {
    const id = link.getAttribute('data-section');
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, link });
  });

  function setActive(id) {
    if (id === currentActive) return;
    currentActive = id;
    navLinks.forEach(l => l.classList.remove('active'));
    const match = [...navLinks].find(l => l.getAttribute('data-section') === id);
    if (match) match.classList.add('active');
  }

  // Scroll-spy: find the topmost section currently in the detection zone.
  function updateScrollSpy() {
    const viewportTop = window.scrollY;
    const offset = window.innerHeight * 0.3;
    let best = sections[0];
    for (const s of sections) {
      if (s.el.offsetTop <= viewportTop + offset) {
        best = s;
      }
    }
    setActive(best.id);
  }

  const observer = new IntersectionObserver(
    () => updateScrollSpy(),
    {
      rootMargin: '-10% 0px -50% 0px',
      threshold: [0, 0.1, 0.5],
    }
  );

  sections.forEach(s => observer.observe(s.el));

  // Throttled scroll handler for fast-scroll reliability + progress bar
  const progressBar = document.getElementById('scroll-progress');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollSpy();

        // Update scroll progress bar
        if (progressBar) {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          progressBar.style.width = progress + '%';
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Section reveal animations (staggered children handled by CSS)
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.section, .footer').forEach(s => revealObserver.observe(s));

  // Mobile nav toggle + scrim
  const toggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('sidebar-scrim');

  function openSidebar() {
    sidebar.classList.add('open');
    if (scrim) scrim.classList.add('visible');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (scrim) scrim.classList.remove('visible');
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });

    if (scrim) {
      scrim.addEventListener('click', closeSidebar);
    }

    document.addEventListener('click', e => {
      if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target) &&
        (!scrim || !scrim.contains(e.target))
      ) {
        closeSidebar();
      }
    });
  }

  // Smooth anchor scrolling with offset for fixed elements
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 24;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
