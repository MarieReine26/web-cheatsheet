// =============================================
// MarieReine Studio - HTML & CSS Cheat Sheet
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ====================== TAB NAVIGATION ====================== //
    function switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        const selectedContent = document.getElementById(tabName);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            selectedContent.classList.add('active');
        }

        document.querySelectorAll('.tabs button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        const activeButton = document.querySelector(`.tabs button[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
        }
    }

    document.querySelectorAll('.tabs button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            if (tabName) switchTab(tabName);
        });
    });

    // ====================== SEARCH ====================== //
    const searchInput = document.getElementById('searchInput');

    function performSearch() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();

        document.querySelectorAll('.content-item').forEach(item => {
            const matches = item.textContent.toLowerCase().includes(query);
            item.style.display = (query === '' || matches) ? '' : 'none';
        });

        // Hide empty sections
        document.querySelectorAll('.content-section').forEach(section => {
            const hasVisible = Array.from(section.querySelectorAll('.content-item'))
                .some(item => item.style.display !== 'none');
            section.style.display = (query === '' || hasVisible) ? '' : 'none';
        });
    }

    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(performSearch, 150);
        });
    }

    // ====================== COPY TO CLIPBOARD ====================== //
    function addCopyButtons() {
        document.querySelectorAll('.item-example pre:not(.copy-enabled)').forEach(pre => {
            pre.classList.add('copy-enabled');

            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = '📋';
            btn.setAttribute('aria-label', 'Copy code');

            btn.addEventListener('click', async () => {
                const text = pre.textContent.trim();
                try {
                    await navigator.clipboard.writeText(text);
                    btn.textContent = '✅';
                    setTimeout(() => btn.textContent = '📋', 1500);
                } catch (err) {
                    btn.textContent = '❌';
                    setTimeout(() => btn.textContent = '📋', 1500);
                }
            });

            pre.style.position = 'relative';
            pre.appendChild(btn);
        });
    }

    // ====================== THEME TOGGLE ====================== 
    const themeToggle = document.getElementById('theme-toggle');

    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            if (themeToggle) themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            if (themeToggle) themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    }

    if (themeToggle) {
        const saved = localStorage.getItem('theme');
        if (saved) {
            setTheme(saved === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme(true);
        } else {
            setTheme(false);
        }

        themeToggle.addEventListener('click', () => {
            setTheme(!document.documentElement.classList.contains('dark'));
        });
    }

    // ====================== PRINT BUTTON ====================== //
    const printBtn = document.getElementById('print-btn');

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Show all content for printing
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'block';
            });
            document.querySelectorAll('.content-item').forEach(item => {
                item.style.display = 'flex';
            });

            if (searchInput) searchInput.value = '';

            document.body.classList.add('print-mode');

            setTimeout(() => {
                window.print();
                setTimeout(() => {
                    document.body.classList.remove('print-mode');
                }, 500);
            }, 150);
        });
    }

    // ====================== BACK TO TOP & GO TO BOTTOM ====================== //
    const backToTopBtn = document.getElementById('back-to-top');
    const goToBottomBtn = document.getElementById('go-to-bottom');

    // --- Back to Top ---
    if (backToTopBtn) {
        backToTopBtn.style.transition = 'opacity 2s ease';
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';

        window.addEventListener('scroll', () => {
            if (window.scrollY > 2000) {                    
                backToTopBtn.style.display = 'flex';
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';

                setTimeout(() => {
                    if (backToTopBtn.style.opacity === '0') {
                        backToTopBtn.style.display = 'none';
                    }
                }, 1000);
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Go to Bottom ---
    if (goToBottomBtn) {
        goToBottomBtn.style.transition = 'opacity 2s ease'; 

        const toggleGoToBottom = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollPosition > documentHeight - 2000) {
                goToBottomBtn.style.opacity = '0';
                goToBottomBtn.style.pointerEvents = 'none';

                setTimeout(() => {
                    if (goToBottomBtn.style.opacity === '0') {
                        goToBottomBtn.style.display = 'none';
                    }
                }, 1000);
            } else {
                goToBottomBtn.style.display = 'flex';
                goToBottomBtn.style.opacity = '1';
                goToBottomBtn.style.pointerEvents = 'auto';
            }
        };

        window.addEventListener('scroll', toggleGoToBottom);
        toggleGoToBottom();

        goToBottomBtn.addEventListener('click', () => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // ====================== KEYBOARD SHORTCUTS ====================== //
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchInput) {
            searchInput.value = '';
            performSearch();
            searchInput.focus();
        }

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
    });

    // ===================== BACKGROUND CANVAS =============== //
    let cleanupCanvas = initBackgroundEffects();

    // ====================== INITIALIZE ======================
    switchTab('html-section');
    addCopyButtons();

    // Re-apply copy buttons dynamically
        const observer = new MutationObserver(addCopyButtons);
        observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (cleanupCanvas) cleanupCanvas();
        });
    });

    // ====================== CANVAS BACKGROUND (outside DOMContentLoaded) ======================
    function initBackgroundEffects() {
        const canvas = document.getElementById('bg-canvas');
            if (!canvas) return () => {};

        const ctx = canvas.getContext('2d', { alpha: true });
            let particles = [];
            let animationFrame;
            let isDark = document.documentElement.classList.contains('dark');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() { this.reset(); }
                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2.2 + 0.8;
                    this.speedX = Math.random() * 0.8 - 0.4;
                    this.speedY = Math.random() * 0.8 - 0.4;
                    this.opacity = Math.random() * 0.5 + 0.3;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                }
                draw() {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = isDark ? '#e0f2fe' : '#3b82f6';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
        }

        function initParticles() {
            particles = [];
                const count = Math.floor((canvas.width * canvas.height) / 9000) + 60;
                    for (let i = 0; i < count; i++) {
                        particles.push(new Particle());
                    }
        }

        function animate() {
            ctx.fillStyle = isDark ? 'rgba(10, 15, 28, 0.15)' : 'rgba(240, 249, 255, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrame = requestAnimationFrame(animate);
        }

        // Theme change observer
        const themeObserver = new MutationObserver(() => {
            const newIsDark = document.documentElement.classList.contains('dark');
                if (newIsDark !== isDark) {
                    isDark = newIsDark;
                    initParticles();
                }
        });
       
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animate();

        return () => cancelAnimationFrame(animationFrame);
    }
