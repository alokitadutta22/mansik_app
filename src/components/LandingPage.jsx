import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const scrollIndicatorRef = useRef(null);
  const breathingCircleRef = useRef(null);

  const goToAuth = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  useEffect(() => {
    // ── Intersection Observer for Chapters ──
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.chapter-content').forEach(content => {
      chapterObserver.observe(content);
    });

    // Sign cards with staggered delay
    const cardObservers = [];
    document.querySelectorAll('.sign-card').forEach((card, index) => {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
          }
        });
      }, observerOptions);
      cardObserver.observe(card);
      cardObservers.push(cardObserver);
    });

    // Journey steps with staggered delay
    const stepObservers = [];
    document.querySelectorAll('.step').forEach((step, index) => {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 200);
          }
        });
      }, observerOptions);
      stepObserver.observe(step);
      stepObservers.push(stepObserver);
    });

    // Pillars with staggered delay
    const pillarObservers = [];
    document.querySelectorAll('.pillar').forEach((pillar, index) => {
      const pillarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 150);
          }
        });
      }, observerOptions);
      pillarObserver.observe(pillar);
      pillarObservers.push(pillarObserver);
    });

    // ── Scroll Indicator ──
    const handleScroll = () => {
      if (scrollIndicatorRef.current) {
        if (window.scrollY > 300) {
          scrollIndicatorRef.current.classList.add('hidden');
        } else {
          scrollIndicatorRef.current.classList.remove('hidden');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    // ── Breathing Circle ──
    const breathingCircle = breathingCircleRef.current;
    let scale = 1;
    let growing = true;
    const breathingInterval = setInterval(() => {
      if (growing) {
        scale += 0.01;
        if (scale >= 2) growing = false;
      } else {
        scale -= 0.01;
        if (scale <= 1) growing = true;
      }
      if (breathingCircle) {
        breathingCircle.style.transform = `translate(-50%, -50%) scale(${scale})`;
        breathingCircle.style.opacity = 0.1 - (scale - 1) * 0.05;
      }
    }, 50);

    // Cleanup
    return () => {
      chapterObserver.disconnect();
      cardObservers.forEach(o => o.disconnect());
      stepObservers.forEach(o => o.disconnect());
      pillarObservers.forEach(o => o.disconnect());
      window.removeEventListener('scroll', handleScroll);
      clearInterval(breathingInterval);
    };
  }, []);

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  const scrollToChapter2 = () => {
    const el = document.querySelector('.chapter-2');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">Sthir-Mann</div>
        <button className="nav-cta" onClick={goToAuth}>Begin Your Journey</button>
      </nav>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" ref={scrollIndicatorRef} onClick={scrollDown}>
        <i className="fas fa-chevron-down"></i>
      </div>

      {/* Breathing Circle */}
      <div className="breathing-circle" ref={breathingCircleRef}></div>

      {/* Chapter 1: The Weight We Carry */}
      <section className="chapter chapter-1">
        <div className="illustration illustration-1">
          <i className="fas fa-cloud"></i>
        </div>
        <div className="chapter-content">
          <p className="chapter-number">Chapter One</p>
          <h1 className="chapter-title">The weight we carry is often invisible.</h1>
          <p className="chapter-text">
            Every day, we navigate a complex world of responsibilities, relationships, and expectations.
            The pressure builds slowly—so slowly that we often don't notice until we're struggling to breathe
            under the weight of it all.
          </p>
          <p className="chapter-text">
            You're not alone in feeling this way. Millions experience the same quiet struggle,
            carrying burdens that others can't see.
          </p>
          <div className="quote">
            "Sometimes the bravest thing you can do is ask for help."
          </div>
        </div>
      </section>

      {/* Chapter 2: Recognizing the Signs */}
      <section className="chapter chapter-2">
        <div className="chapter-content">
          <p className="chapter-number">Chapter Two</p>
          <h2 className="chapter-title">The signs speak softly, but they're always there.</h2>
          <p className="chapter-text">
            Mental wellness isn't about being happy all the time. It's about balance—recognizing when
            something feels off and having the courage to address it.
          </p>

          <div className="signs-grid">
            <div className="sign-card">
              <div className="sign-icon"><i className="fas fa-moon"></i></div>
              <h3 className="sign-title">Sleep Disruptions</h3>
              <p className="sign-desc">Restless nights, racing thoughts, or sleeping too much can signal emotional imbalance.</p>
            </div>

            <div className="sign-card">
              <div className="sign-icon"><i className="fas fa-battery-quarter"></i></div>
              <h3 className="sign-title">Low Energy</h3>
              <p className="sign-desc">Feeling drained even after rest, or losing interest in things you once enjoyed.</p>
            </div>

            <div className="sign-card">
              <div className="sign-icon"><i className="fas fa-users-slash"></i></div>
              <h3 className="sign-title">Social Withdrawal</h3>
              <p className="sign-desc">Pulling away from friends and family, preferring isolation over connection.</p>
            </div>

            <div className="sign-card">
              <div className="sign-icon"><i className="fas fa-mountain"></i></div>
              <h3 className="sign-title">Overwhelm</h3>
              <p className="sign-desc">Small tasks feel insurmountable, and you can't see a way forward.</p>
            </div>

            <div className="sign-card">
              <div className="sign-icon"><i className="fas fa-balance-scale"></i></div>
              <h3 className="sign-title">Loss of Balance</h3>
              <p className="sign-desc">Work consumes you, or relationships suffer because you're stretched too thin.</p>
            </div>

            <div className="sign-card">
              <div className="sign-icon"><i className="fas fa-wind"></i></div>
              <h3 className="sign-title">Constant Worry</h3>
              <p className="sign-desc">Your mind never rests, always anticipating the next problem or crisis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Your Journey Begins */}
      <section className="chapter chapter-3">
        <div className="chapter-content">
          <p className="chapter-number">Chapter Three</p>
          <h2 className="chapter-title">Every journey begins with a single step.</h2>
          <p className="chapter-text">
            Sthir-Mann walks beside you, gently guiding you toward balance. Not with judgment,
            but with understanding. Not with quick fixes, but with sustainable change.
          </p>

          <div className="journey-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Awareness</h3>
                <p className="step-desc">
                  Begin by understanding your current state. Take the PSS-14 assessment to measure
                  your stress levels. No judgment—just honest reflection. This is your baseline,
                  your starting point on the path to wellness.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Understanding</h3>
                <p className="step-desc">
                  Create your personal wellness map. Identify the pillars of your life—work, relationships,
                  health, creativity. See where you're thriving and where you're struggling.
                  Knowledge is the first step toward healing.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Tracking</h3>
                <p className="step-desc">
                  Gently note your daily experiences. How much time in nature? Quality time with loved ones?
                  Moments of joy? Hours of stress? The patterns will reveal themselves,
                  showing you where balance has been lost.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Restoring</h3>
                <p className="step-desc">
                  Receive personalized insights and gentle nudges toward balance. Not drastic changes,
                  but small, sustainable shifts. More sleep here, less social media there.
                  A walk in the park. A call to an old friend. Balance returns gradually, naturally.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3 className="step-title">Support</h3>
                <p className="step-desc">
                  When you need more than self-care, we connect you with professionals who understand.
                  No stigma. No judgment. Just compassionate support from those trained to help
                  you find your way back to balance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 4: Understanding Balance */}
      <section className="chapter chapter-4">
        <div className="chapter-content">
          <p className="chapter-number">Chapter Four</p>
          <h2 className="chapter-title">Balance isn't perfection—it's harmony.</h2>
          <p className="chapter-text">
            Your life is composed of many pillars, each deserving attention and care.
            When one pillar dominates, the others weaken. True wellness comes from nurturing all parts of yourself.
          </p>

          <div className="balance-visual">
            <div className="pillar">
              <div className="pillar-circle"><i className="fas fa-heartbeat"></i></div>
              <p className="pillar-name">Health</p>
            </div>
            <div className="pillar">
              <div className="pillar-circle"><i className="fas fa-spa"></i></div>
              <p className="pillar-name">Habits</p>
            </div>
            <div className="pillar">
              <div className="pillar-circle"><i className="fas fa-heart"></i></div>
              <p className="pillar-name">Relationships</p>
            </div>
            <div className="pillar">
              <div className="pillar-circle"><i className="fas fa-briefcase"></i></div>
              <p className="pillar-name">Work</p>
            </div>
            <div className="pillar">
              <div className="pillar-circle"><i className="fas fa-palette"></i></div>
              <p className="pillar-name">Joy</p>
            </div>
          </div>

          <p className="chapter-text" style={{ marginTop: '3rem', textAlign: 'center' }}>
            When these pillars stand together in balance, you feel grounded, present, and at peace.
          </p>
        </div>
      </section>

      {/* Chapter 5: The Path Forward */}
      <section className="chapter chapter-5">
        <div className="chapter-content">
          <p className="chapter-number">Chapter Five</p>
          <h2 className="chapter-title">Your story doesn't end here. It begins.</h2>
          <p className="chapter-text">
            This is your invitation to write a new chapter—one where you prioritize your wellbeing,
            honor your needs, and find balance in the beautiful chaos of life.
          </p>

          <div className="cta-group">
            <button className="btn-primary" onClick={goToAuth}>Start Your Journey</button>
            <button className="btn-secondary" onClick={scrollToChapter2}>Learn More</button>
          </div>

          <div className="testimonial">
            <p className="testimonial-text">
              "MANSik helped me see that my struggles weren't weaknesses—they were signs
              that I needed to care for myself. For the first time in years, I feel balanced."
            </p>
            <p className="testimonial-author">— A fellow traveler on this journey</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-quote">
            "In the midst of movement and chaos, keep stillness inside of you." — Deepak Chopra
          </p>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </div>
          <p>&copy; 2024 Sthir-Mann. Your wellness journey starts here.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
