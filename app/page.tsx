"use client";
import { useEffect, useState, useRef } from "react";
import { i18n, Lang } from "../lib/i18n";

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            en.target
              .querySelectorAll<HTMLElement>("[data-target]")
              .forEach((c) => {
                if (!c.dataset.done) {
                  c.dataset.done = "1";
                  animateCounter(c);
                }
              });
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((el) => io.observe(el));
    const t = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.in)")
        .forEach((el) => el.classList.add("in"));
      document
        .querySelectorAll<HTMLElement>("[data-target]:not([data-done])")
        .forEach((el) => {
          el.dataset.done = "1";
          animateCounter(el);
        });
    }, 1200);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);
}

function animateCounter(el: HTMLElement) {
  const target = parseFloat(el.dataset.target || "0");
  const fmt = el.dataset.format;
  const dur = 1800;
  const t0 = performance.now();
  function tick(t: number) {
    const p = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - p, 4);
    const cur = target * e;
    let txt: string;
    if (fmt === "K") txt = Math.round(cur / 1000) + "K";
    else
      txt =
        target >= 1000
          ? Math.round(cur).toLocaleString()
          : String(Math.round(cur));
    el.textContent = txt;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function Page() {
  const [lang, setLang] = useState<Lang>("ko");
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  useReveal();

  const t = (k: string) => i18n[lang][k] ?? k;

  const [submitting, setSubmitting] = useState(false);

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const f = e.currentTarget;
    const fd = new FormData(f);
    const params = new URLSearchParams();
    fd.forEach((v, k) => {
      params.append(k, typeof v === "string" ? v : "");
    });
    setSubmitting(true);
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      f.reset();
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert(
        lang === "ko"
          ? "전송에 실패했습니다. 잠시 후 다시 시도하시거나 company@oysterable.com 으로 직접 보내주세요."
          : "Submission failed. Please try again or email company@oysterable.com directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav__brand" aria-label="오이스터에이블">
          <img src="/site/oysterable-symbol.svg" alt="" />
          <span>{lang === "ko" ? "오이스터에이블" : "Oysterable"}</span>
        </a>
        <div className="nav__links">
          <a href="#what">{t("nav.svc")}</a>
          <a href="#tech">{t("nav.tech")}</a>
          <a href="#cases">{t("nav.case")}</a>
          <a href="#smart">{t("nav.smart")}</a>
          <a href="#contact">{t("nav.con")}</a>
          <div className="lang">
            <button
              onClick={() => setLang("ko")}
              className={lang === "ko" ? "active" : ""}
            >
              한
            </button>
            <span>·</span>
            <button
              onClick={() => setLang("en")}
              className={lang === "en" ? "active" : ""}
            >
              EN
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero__bg">
          <img src="/site/hero.jpg" alt="" />
        </div>
        <div className="hero__inner">
          <div className="hero__text">
            <div className="eyebrow reveal">{t("hero.eye")}</div>
            <h1 className="reveal">
              <span dangerouslySetInnerHTML={{ __html: t("hero.title") }} />
            </h1>
            <p className="hero__sub reveal">{t("hero.sub")}</p>
            <div className="hero__cta reveal">
              <a href="#what" className="btn btn--primary">
                {t("hero.cta1")} <span className="arrow">→</span>
              </a>
              <a href="#contact" className="btn btn--ghost">
                {t("hero.cta2")}
              </a>
            </div>
          </div>
          <div className="hero__counters">
            <div className="reveal">
              <div className="h-c__big">
                <span data-target="1041">0</span>
                <span className="unit">{t("hero.c1u")}</span>
              </div>
              <div className="h-c__label">{t("hero.c1")}</div>
            </div>
            <div className="reveal">
              <div className="h-c__big">
                <span data-target="120000" data-format="K">
                  0
                </span>
              </div>
              <div className="h-c__label">{t("hero.c2")}</div>
            </div>
            <div className="reveal">
              <div className="h-c__big">
                <span data-target="624">0</span>
                <span className="unit">{t("hero.c3u")}</span>
              </div>
              <div className="h-c__label">{t("hero.c3")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-strip">
        <div className="gallery-strip__inner">
          <div className="gallery-strip__head">
            <div className="gallery-strip__title">{t("gal.t")}</div>
          </div>
          <div className="gallery-strip__row">
            <div className="gallery-strip__item"><img src="/site/gallery-1.jpg" alt="" /></div>
            <div className="gallery-strip__item"><img src="/site/gallery-2.jpg" alt="" /></div>
            <div className="gallery-strip__item"><img src="/site/gallery-3.jpg" alt="" /></div>
            <div className="gallery-strip__item"><img src="/site/gallery-4.jpg" alt="" /></div>
            <div className="gallery-strip__item"><img src="/site/gallery-5.jpg" alt="" /></div>
            <div className="gallery-strip__item"><img src="/site/gallery-6.jpg" alt="" /></div>
          </div>
        </div>
      </section>

      <section className="mission">
        <p className="reveal">
          <span>{t("m.t1")}</span>
          <span className="light">{t("m.t2")}</span>
        </p>
      </section>

      <section id="what">
        <div className="sec-h reveal">
          <div className="infinity-glyph">
            <span className="ring"></span>
            <span className="ring ring--r"></span>
          </div>
          <div className="eyebrow">{t("svc.eye")}</div>
          <h2>
            <span>{t("svc.h1")}</span>
            <br />
            <span className="light">{t("svc.h2")}</span>
          </h2>
          <div
            className="meta"
            dangerouslySetInnerHTML={{ __html: t("svc.intro") }}
          />
        </div>

        <div className="services__list">
          <div className="svc reveal">
            <div className="svc__copy">
              <div className="svc__cycle-tag">
                <span className="dot"></span>
                <span>{t("svc.s1.tag")}</span>
              </div>
              <div className="svc__name">
                <span>{t("svc.s1.name")}</span>
                <span className="small">{t("svc.s1.sub")}</span>
              </div>
              <p className="svc__desc">{t("svc.s1.desc")}</p>
              <ul className="svc__bullets">
                <li>{t("svc.s1.b1")}</li>
                <li>{t("svc.s1.b2")}</li>
                <li>{t("svc.s1.b3")}</li>
                <li>{t("svc.s1.b4")}</li>
              </ul>
            </div>
            <div className="svc__visuals">
              <div className="svc__visual-main">
                <img src="/site/reuse-main.jpg" alt="라라루프 다회용컵 반납기" />
              </div>
              <div className="svc__visual-sm">
                <img src="/site/reuse-1.jpg" alt="다회용컵 운영" />
              </div>
              <div className="svc__visual-sm">
                <img src="/site/reuse-2.jpg" alt="다회용컵 회로" />
              </div>
            </div>
          </div>

          <div className="svc svc--recycle reveal">
            <div className="svc__copy">
              <div className="svc__cycle-tag">
                <span className="dot"></span>
                <span>{t("svc.s2.tag")}</span>
              </div>
              <div className="svc__name">
                <span>{t("svc.s2.name")}</span>
                <span className="small">{t("svc.s2.sub")}</span>
              </div>
              <p className="svc__desc">{t("svc.s2.desc")}</p>
              <ul className="svc__bullets">
                <li>{t("svc.s2.b1")}</li>
                <li>{t("svc.s2.b2")}</li>
                <li>{t("svc.s2.b3")}</li>
                <li>{t("svc.s2.b4")}</li>
              </ul>
            </div>
            <div className="svc__visuals">
              <div className="svc__visual-main">
                <img src="/site/recycle-main.jpg" alt="AI 자동선별로봇" />
              </div>
              <div className="svc__visual-sm">
                <img src="/site/recycle-1.jpg" alt="오늘의 분리수거 앱" />
              </div>
              <div className="svc__visual-sm">
                <img src="/site/recycle-2.jpg" alt="AI 비전 자원 인식" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tech">
        <div className="sec-h reveal">
          <div className="eyebrow">{t("tech.eye")}</div>
          <h2>
            <span>{t("tech.h1")}</span>{" "}
            <span className="light">{t("tech.h2")}</span>
          </h2>
          <div className="meta">{t("tech.intro")}</div>
        </div>
        <div className="tech__grid">
          {[
            ["T-001", "AI", "tech.t1", "tech.p1", "95", "%+", "tech.m1"],
            ["T-002", "IoT", "tech.t2", "tech.p2", "4", "×", "tech.m2"],
            ["T-003", "CO₂", "tech.t3", "tech.p3", "624", "톤", "tech.m3"],
            ["T-004", "App", "tech.t4", "tech.p4", "112K", "+", "tech.m4"],
            ["T-005", "DPP", "tech.t5", "tech.p5", "QR · RFID", "", "tech.m5"],
          ].map(([num, ico, tk, pk, mNum, mUnit, mLabel], i) => (
            <div className="tech-card reveal" key={i}>
              <div>
                <div className="tech-card__num">[{num}]</div>
                <div className="tech-card__icon">{ico}</div>
                <h3>{t(tk)}</h3>
                <p>{t(pk)}</p>
              </div>
              <div className="tech-card__metric">
                <div
                  className="tech-card__metric-num"
                  style={{
                    fontSize: i === 4 ? "30px" : undefined,
                  }}
                >
                  {mNum}
                  <span style={{ fontSize: "0.55em" }}>{mUnit}</span>
                </div>
                <div className="tech-card__metric-label">{t(mLabel)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="numbers">
        <div className="sec-h reveal">
          <h2>{t("num.h1")}</h2>
        </div>
        <div className="numbers__grid">
          <div className="num-cell reveal">
            <div className="num-cell__big">
              <span data-target="1041">0</span>
            </div>
            <div className="num-cell__label">{t("num.l1")}</div>
          </div>
          <div className="num-cell reveal">
            <div className="num-cell__big">
              <span data-target="120000" data-format="K">
                0
              </span>
            </div>
            <div className="num-cell__label">{t("num.l2")}</div>
          </div>
          <div className="num-cell reveal">
            <div className="num-cell__big">
              <span data-target="624">0</span>
              <span className="unit">{t("num.u3")}</span>
            </div>
            <div className="num-cell__label">{t("num.l3")}</div>
          </div>
          <div className="num-cell reveal">
            <div className="num-cell__big">
              <span data-target="62">0</span>
              <span className="unit">+</span>
            </div>
            <div className="num-cell__label">{t("num.l4")}</div>
          </div>
        </div>
      </section>

      <section id="cases">
        <div className="sec-h reveal">
          <div className="eyebrow">{t("case.eye")}</div>
          <h2>{t("case.h1")}</h2>
          <div className="meta">{t("case.intro")}</div>
        </div>

        <div className="cases__grid">
          {[
            { i: 1, cyc: "REUSE", ico: "🏛", recycle: false },
            { i: 2, cyc: "REUSE", ico: "🏛", recycle: false },
            { i: 3, cyc: "RECYCLE", ico: "🛒", recycle: true },
            { i: 4, cyc: "RECYCLE", ico: "🏪", recycle: true },
            { i: 5, cyc: "RECYCLE", ico: "🌆", recycle: true },
            { i: 6, cyc: "REUSE", ico: "☕", recycle: false },
          ].map(({ i, ico, recycle }) => (
            <div
              key={i}
              className={`case-card reveal${recycle ? " cyc-recycle" : ""}`}
            >
              <div>
                <div className="case-card__cycle">
                  <span className="dot"></span>
                  <span>{t(`case.c${i}.cyc`)}</span>
                </div>
                <div className="case-card__name">
                  <span className="ico">{ico}</span>
                  <span>{t(`case.c${i}.n`)}</span>
                </div>
                <p className="case-card__desc">{t(`case.c${i}.d`)}</p>
              </div>
              <div className="case-card__metrics">
                {i === 1 && (
                  <div className="case-card__metric">
                    <span>{t("case.c1.m1")}</span>
                    <span className="v">{t("case.c1.v1")}</span>
                  </div>
                )}
                {i === 2 && (
                  <>
                    <div className="case-card__metric">
                      <span>{t("case.c2.m1")}</span>
                      <span className="v">
                        247,800<span>{t("case.c2.u1")}</span>
                      </span>
                    </div>
                    <div className="case-card__metric">
                      <span>{t("case.c2.m2")}</span>
                      <span className="v">92%</span>
                    </div>
                    <div className="case-card__metric">
                      <span>{t("case.c2.m3")}</span>
                      <span className="v">
                        19<span>{t("case.c2.u3")}</span>
                      </span>
                    </div>
                  </>
                )}
                {i === 3 && (
                  <div className="case-card__metric">
                    <span>{t("case.c3.m1")}</span>
                    <span className="v">{t("case.c3.v1")}</span>
                  </div>
                )}
                {i === 4 && (
                  <>
                    <div className="case-card__metric">
                      <span>{t("case.c4.m1")}</span>
                      <span className="v">
                        13.5<span>{t("case.c4.u1")}</span> → 335
                        <span>{t("case.c4.u1b")}</span>
                      </span>
                    </div>
                    <div className="case-card__metric">
                      <span>{t("case.c4.m2")}</span>
                      <span className="v">+2,500%</span>
                    </div>
                  </>
                )}
                {i === 5 && (
                  <div className="case-card__metric">
                    <span>{t("case.c5.m1")}</span>
                    <span className="v">
                      1,041<span>{t("case.c5.u1")}</span>
                    </span>
                  </div>
                )}
                {i === 6 && (
                  <div className="case-card__metric">
                    <span>{t("case.c6.m1")}</span>
                    <span className="v">
                      100<span>{t("case.c6.u1")}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="case-extra reveal">
          <div className="case-extra__label">{t("case.extra")}</div>
          <span className="pill">Jeju Airport · 제주공항</span>
          <span className="pill">Busan Baseball Stadium · 부산 야구장</span>
          <span className="pill">Mapo-gu City Hall · 마포구청</span>
          <span className="pill">Magok Apartment · 마곡 아파트</span>
          <span className="pill">Lotte Tower · 롯데타워</span>
          <span className="pill">40S Cafe · 40초 카페</span>
          <span className="pill">Gyeonggi PG Building · 경기도청</span>
        </div>
      </section>

      <section className="fb-strip">
        <div className="fb-strip__inner">
          <div className="fb-strip__item"><img src="/site/fb-1.jpg" alt="" /></div>
          <div className="fb-strip__item"><img src="/site/fb-2.jpg" alt="" /></div>
          <div className="fb-strip__item"><img src="/site/fb-3.jpg" alt="" /></div>
          <div className="fb-strip__item"><img src="/site/fb-4.jpg" alt="" /></div>
          <div className="fb-strip__item"><img src="/site/fb-5.jpg" alt="" /></div>
        </div>
      </section>

      <section id="recog">
        <div className="sec-h reveal">
          <div className="eyebrow">{t("rec.eye")}</div>
          <h2>{t("rec.h1")}</h2>
        </div>
        <div className="recog__grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="recog-card reveal">
              <div className="recog-card__year">
                {i === 1 || i === 2 ? "2023" : i === 5 ? "2024–25" : "2024"}
              </div>
              <div className="recog-card__name">{t(`rec.r${i}`)}</div>
              <div className="recog-card__org">{t(`rec.o${i}`)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="partners">
        <div className="sec-h reveal">
          <div className="eyebrow">{t("cust.eye")}</div>
          <h2>{t("cust.h1")}</h2>
          <div className="meta">{t("cust.intro")}</div>
        </div>
        <div className="cust__grid reveal">
          <div className="cust-cell">Starbucks</div>
          <div className="cust-cell">EMART</div>
          <div className="cust-cell">GS25</div>
          <div className="cust-cell">SSG Point</div>
          <div className="cust-cell">{t("cust.c5")}</div>
          <div className="cust-cell">{t("cust.c6")}</div>
          <div className="cust-cell">LOTTE</div>
          <div className="cust-cell">{t("cust.c8")}</div>
          <div className="cust-cell">{t("cust.c9")}</div>
          <div className="cust-cell">{t("cust.c10")}</div>
          <div className="cust-cell">{t("cust.c11")}</div>
          <div className="cust-cell">{t("cust.c12")}</div>
        </div>
      </section>

      <section id="smart">
        <div className="sec-h reveal">
          <div className="eyebrow">{t("sc.eye")}</div>
          <h2>{t("sc.h1")}</h2>
          <div className="meta">{t("sc.intro")}</div>
        </div>

        <div className="sc-features">
          {[1, 2, 3, 4, 5].map((i) => (
            <div className="sc-feat reveal" key={i}>
              <div>
                <div className="sc-feat__num">[F-0{i}]</div>
                <h4>{t(`sc.f${i}.t`)}</h4>
                <p>{t(`sc.f${i}.p`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="sc-cities reveal">
          <div className="sc-cities__title">{t("sc.cities.t")}</div>
          <div className="sc-cities__grid sc-cities__grid--single">
            <div className="sc-city sc-city--feature">
              <div className="sc-city__name">🌴 Jeju Smart City</div>
              <div className="sc-city__year">{t("sc.c5.y")}</div>
              <div className="sc-city__role">{t("sc.c5.r")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <h2 className="contact__h reveal">
          <span>{t("con.h1")}</span>
          <br />
          <span className="light">{t("con.h2")}</span>
        </h2>
        <div className="contact__btns reveal">
          <a
            href="mailto:company@oysterable.com"
            className="btn btn--primary"
          >
            company@oysterable.com <span className="arrow">→</span>
          </a>
          <a href="tel:+827048275577" className="btn btn--ghost">
            +82 70 4827 5577
          </a>
        </div>

        <form
          ref={formRef}
          className="contact-form reveal"
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={submitContact}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>
          <div className="contact-form__title">{t("cf.t")}</div>
          <div className="contact-form__sub">{t("cf.s")}</div>
          <div className="contact-form__grid">
            <div className="contact-form__field">
              <label className="contact-form__label">
                {t("cf.name")}
                <span className="req">*</span>
              </label>
              <input
                className="contact-form__input"
                name="name"
                type="text"
                required
                placeholder="홍길동"
              />
            </div>
            <div className="contact-form__field">
              <label className="contact-form__label">
                {t("cf.company")}
                <span className="req">*</span>
              </label>
              <input
                className="contact-form__input"
                name="company"
                type="text"
                required
                placeholder="(주) 오이스터에이블"
              />
            </div>
            <div className="contact-form__field">
              <label className="contact-form__label">
                {t("cf.email")}
                <span className="req">*</span>
              </label>
              <input
                className="contact-form__input"
                name="email"
                type="email"
                required
                placeholder="hello@example.com"
              />
            </div>
            <div className="contact-form__field">
              <label className="contact-form__label">{t("cf.phone")}</label>
              <input
                className="contact-form__input"
                name="phone"
                type="tel"
                placeholder="010-0000-0000"
              />
            </div>
            <div className="contact-form__field">
              <label className="contact-form__label">
                {t("cf.purpose")}
                <span className="req">*</span>
              </label>
              <select className="contact-form__select" name="purpose" required>
                <option value="meeting">{t("cf.p1")}</option>
                <option value="b2g">{t("cf.p2")}</option>
                <option value="b2b">{t("cf.p3")}</option>
                <option value="press">{t("cf.p4")}</option>
                <option value="invest">{t("cf.p5")}</option>
                <option value="other">{t("cf.p6")}</option>
              </select>
            </div>
            <div className="contact-form__field">
              <label className="contact-form__label">{t("cf.when")}</label>
              <input
                className="contact-form__input"
                name="preferredDate"
                type="text"
                placeholder="예: 5월 둘째 주 오후"
              />
            </div>
            <div className="contact-form__field contact-form__field--full">
              <label className="contact-form__label">
                {t("cf.msg")}
                <span className="req">*</span>
              </label>
              <textarea
                className="contact-form__textarea"
                name="message"
                required
                placeholder="도입 규모, 운영 환경, 일정, 알고 싶으신 점 등 자유롭게 작성해 주세요."
              />
            </div>
            <label className="contact-form__check contact-form__field--full">
              <input type="checkbox" name="privacy" required />
              <span>{t("cf.privacy")}</span>
            </label>
          </div>
          <button
            type="submit"
            className="contact-form__submit"
            disabled={submitting}
          >
            {submitting ? (lang === "ko" ? "전송 중..." : "Sending...") : t("cf.submit")}{" "}
            <span className="arrow">→</span>
          </button>
          <div
            className={`contact-form__success${showSuccess ? " show" : ""}`}
          >
            {t("cf.success")}
          </div>
        </form>

        <footer>
          <div className="footer__grid">
            <div className="footer__brand">
              <strong>Oysterable, Inc. · 오이스터에이블(주)</strong>
              <span>{t("ft.ceo")}</span>
              <br />
              <span>{t("ft.addr")}</span>
            </div>
            <div className="footer__col">
              <h5>{t("ft.svc")}</h5>
              <a href="#what">{t("ft.svc1")}</a>
              <a href="#what">{t("ft.svc2")}</a>
              <a href="#tech">{t("ft.svc3")}</a>
              <a href="#smart">{t("ft.svc4")}</a>
            </div>
            <div className="footer__col">
              <h5>{t("ft.com")}</h5>
              <a href="#cases">{t("ft.com1")}</a>
              <a href="#recog">{t("ft.com2")}</a>
              <a href="#partners">{t("ft.com3")}</a>
            </div>
            <div className="footer__col">
              <h5>{t("ft.con")}</h5>
              <a href="mailto:company@oysterable.com">company@oysterable.com</a>
              <a href="tel:+827048275577">070-4827-5577</a>
            </div>
          </div>
          <div className="footer__bottom">
            <div>© 2026 Oysterable, Inc. All rights reserved.</div>
            <div>{t("ft.tag")}</div>
          </div>
        </footer>
      </section>
    </>
  );
}
