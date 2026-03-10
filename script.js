// ─── Scroll-Spy ───────────────────────────────
// Highlights the sidebar link corresponding to the currently visible section.

(function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [];

  // Build section list from nav links
  navLinks.forEach(link => {
    const id = link.getAttribute('data-section');
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, link });
  });

  function setActive(id) {
    navLinks.forEach(l => l.classList.remove('active'));
    const match = [...navLinks].find(l => l.getAttribute('data-section') === id);
    if (match) match.classList.add('active');
  }

  // Use IntersectionObserver for performant scroll detection
  const observer = new IntersectionObserver(
    entries => {
      // Find the topmost visible section
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(s => observer.observe(s.el));

  // ─── Section Reveal Animations ────────────────
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section').forEach(s => revealObserver.observe(s));

  // ─── Mobile Nav Toggle ──────────────────────────
  const toggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.getElementById('sidebar');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when a nav link is clicked (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', e => {
      if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        sidebar.classList.remove('open');
      }
    });
  }
})();
