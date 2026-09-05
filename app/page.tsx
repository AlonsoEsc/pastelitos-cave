'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Cloud, Flower2, Heart, Plus, Sparkles, X } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const photos = [
  { src: '/images/mercy-12.jpeg', alt: 'Mercy sonriendo con su vestido rojo a cuadros' },
  { src: '/images/mercy-14.jpeg', alt: 'Mercy con un hermoso ramo de flores rosadas' },
  { src: '/images/mercy-07.jpeg', alt: 'Mercy tomándose una foto frente a un espejo' },
  { src: '/images/mercy-15.jpeg', alt: 'Mercy disfrutando un jardín lleno de flores' },
  { src: '/images/mercy-01.jpeg', alt: 'Primer plano de Mercy sonriendo' },
  { src: '/images/mercy-10.jpeg', alt: 'Mercy con vestido celeste y una sonrisa suave' },
  { src: '/images/mercy-08.jpeg', alt: 'Mercy sonriendo frente a un espejo' },
  { src: '/images/mercy-11.jpeg', alt: 'Retrato de Mercy con el cabello color vino' },
  { src: '/images/mercy-04.jpeg', alt: 'Mercy descansando y sonriendo' },
  { src: '/images/mercy-09.jpeg', alt: 'Mercy paseando en un día soleado' },
  { src: '/images/mercy-06.jpeg', alt: 'Mercy usando lentes de sol' },
  { src: '/images/mercy-13.jpeg', alt: 'Selfie soleada de Mercy' },
  { src: '/images/mercy-16.jpeg', alt: 'Mercy en un jardín tropical' },
  { src: '/images/mercy-02.jpeg', alt: 'Collage de selfies de Mercy' },
  { src: '/images/mercy-03.jpeg', alt: 'Retrato cálido de Mercy' },
  { src: '/images/mercy-05.jpeg', alt: 'Collage de la mirada de Mercy' },
];

const baseLikes = [
  { name: 'Hello Kitty', note: 'Moñitos, ternura y ese toque clásico que siempre le queda perfecto.', tone: 'cherry' },
  { name: 'Cinnamoroll', note: 'Nubecitas suaves, celeste y toda la calma del personaje más dulce.', tone: 'cloud' },
  { name: 'Todo rosadito', note: 'Desde los pequeños detalles hasta un mundo entero teñido de rosa.', tone: 'pink' },
  { name: 'Las flores', note: 'Cada una con su propio significado, como los recuerdos bonitos.', tone: 'flower' },
];

type WebMCPContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: unknown) => unknown;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

function useParallax() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      elements.forEach((element) => {
        const speed = Number(element.dataset.parallax || 0.08);
        element.style.setProperty('--parallax-y', `${y * speed}px`);
      });
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

export default function Home() {
  useParallax();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [customLikes, setCustomLikes] = useState<string[]>([]);
  const [newLike, setNewLike] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('mercy-favorites');
    if (saved) {
      try {
        setCustomLikes(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem('mercy-favorites');
      }
    }
  }, []);

  useEffect(() => {
    if (!carouselApi || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => carouselApi.scrollNext(), 3800);
    return () => window.clearInterval(timer);
  }, [carouselApi, paused]);

  const totalLikes = useMemo(() => baseLikes.length + customLikes.length, [customLikes]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMCPContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    void Promise.resolve(context.registerTool({
      name: 'add_mercy_favorite',
      title: 'Agregar favorito de Mercy',
      description: 'Añade una nueva cosa que le gusta a Mercy y la muestra en la sección de favoritos.',
      inputSchema: {
        type: 'object',
        properties: { favorite: { type: 'string', minLength: 1, maxLength: 60 } },
        required: ['favorite'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const favorite = typeof input === 'object' && input !== null && 'favorite' in input
          ? String((input as { favorite: unknown }).favorite).trim()
          : '';
        if (!favorite || favorite.length > 60) throw new Error('El favorito debe tener entre 1 y 60 caracteres.');
        const next = [...customLikes, favorite];
        saveLikes(next);
        return { favorite, total: baseLikes.length + next.length };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);

    return () => lifecycle.abort();
  }, [customLikes]);

  function saveLikes(next: string[]) {
    setCustomLikes(next);
    window.localStorage.setItem('mercy-favorites', JSON.stringify(next));
  }

  function addLike(event: FormEvent) {
    event.preventDefault();
    const value = newLike.trim();
    if (!value) return;
    saveLikes([...customLikes, value]);
    setNewLike('');
  }

  return (
    <main className="site-shell">
      <nav className="floating-nav" aria-label="Navegación principal">
        <a className="brand-mark" href="#inicio" aria-label="Ir al inicio">M</a>
        <div className="nav-links">
          <a href="#ella">Ella</a>
          <a href="#favoritos">Sus favoritos</a>
          <a href="#recuerdos">Recuerdos</a>
        </div>
        <a className="nav-heart" href="#carta" aria-label="Ir a la carta final"><Heart aria-hidden="true" /></a>
      </nav>

      <section id="inicio" className="hero-section">
        <div className="parallax-orb orb-one" data-parallax="-0.06" />
        <div className="parallax-orb orb-two" data-parallax="0.12" />
        <div className="hero-copy" data-parallax="0.035">
          <p className="eyebrow"><Sparkles aria-hidden="true" /> un rinconcito para</p>
          <h1>Mariela<br />Alejandra</h1>
          <div className="mercy-script">Mercy</div>
          <p className="hero-intro">
            Para la niña que vuelve más bonito el mundo con su sonrisa, sus colores y su manera tan especial de ser.
          </p>
          <a className="love-button" href="#ella">
            Ver su mundo <Heart aria-hidden="true" fill="currentColor" />
          </a>
        </div>

        <div className="hero-collage" aria-label="Fotos destacadas de Mercy">
          <div className="photo-card photo-card-main" data-parallax="-0.05">
            <img src="/images/mercy-12.jpeg" alt="Mercy sonriendo frente a un espejo" />
            <span>mi niña bonita ♡</span>
          </div>
          <div className="photo-card photo-card-small" data-parallax="0.08">
            <img src="/images/mercy-14.jpeg" alt="Mercy recibiendo un ramo rosado" />
          </div>
          <div className="mini-note" data-parallax="-0.11">
            <Flower2 aria-hidden="true" />
            <span>ella florece<br />donde va</span>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span /> sigue bajando</div>
      </section>

      <section id="ella" className="intro-section section-wrap">
        <div className="section-number">01</div>
        <div className="intro-title">
          <p className="eyebrow">la protagonista</p>
          <h2>Ella es <em>Mercy</em></h2>
        </div>
        <div className="intro-text">
          <p>Mariela Alejandra Cruz Aguirre.</p>
          <p>Una colección de miradas bonitas, sonrisas sinceras y momentos que merecen guardarse para siempre.</p>
        </div>
        <div className="portrait-ribbon" data-parallax="0.025">
          <figure><img src="/images/mercy-11.jpeg" alt="Retrato cercano de Mercy" /><figcaption>dulce</figcaption></figure>
          <figure><img src="/images/mercy-07.jpeg" alt="Mercy sonriendo en un espejo" /><figcaption>auténtica</figcaption></figure>
          <figure><img src="/images/mercy-10.jpeg" alt="Mercy con vestido celeste" /><figcaption>inolvidable</figcaption></figure>
        </div>
      </section>

      <section id="favoritos" className="favorites-section">
        <div className="flower-backdrop" data-parallax="-0.035">
          <img src="/images/floriografia.jpeg" alt="Guía ilustrada del significado de distintas flores" />
        </div>
        <div className="favorites-panel section-wrap">
          <div className="favorites-heading">
            <div>
              <p className="eyebrow light"><Flower2 aria-hidden="true" /> su pequeño universo</p>
              <h2>Cosas que hacen<br /><em>feliz a Mercy</em></h2>
            </div>
            <p>{totalLikes.toString().padStart(2, '0')} favoritos guardados</p>
          </div>

          <div className="likes-grid">
            {baseLikes.map((item, index) => (
              <article className={`like-card ${item.tone}`} key={item.name}>
                <span className="like-index">0{index + 1}</span>
                <div className="like-icon" aria-hidden="true">
                  {item.tone === 'cloud' ? <Cloud /> : item.tone === 'flower' ? <Flower2 /> : <Heart />}
                </div>
                <h3>{item.name}</h3>
                <p>{item.note}</p>
              </article>
            ))}
            {customLikes.map((item, index) => (
              <article className="like-card custom" key={`${item}-${index}`}>
                <span className="like-index">{String(baseLikes.length + index + 1).padStart(2, '0')}</span>
                <Heart className="like-icon" aria-hidden="true" />
                <h3>{item}</h3>
                <p>Otra cosita que pertenece al mundo de Mercy.</p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="remove-like"
                  onClick={() => saveLikes(customLikes.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label={`Quitar ${item}`}
                >
                  <X />
                </Button>
              </article>
            ))}
          </div>

          <form className="add-like" onSubmit={addLike}>
            <label htmlFor="new-favorite">¿Qué otra cosita le encanta?</label>
            <div className="add-like-controls">
              <Input
                id="new-favorite"
                value={newLike}
                onChange={(event) => setNewLike(event.target.value)}
                placeholder="Ej. los atardeceres..."
                maxLength={60}
              />
              <Button type="submit" disabled={!newLike.trim()}>
                <Plus aria-hidden="true" /> Agregar
              </Button>
            </div>
            <small>Se guarda en este dispositivo para que el rinconcito siga creciendo.</small>
          </form>
        </div>
      </section>

      <section id="recuerdos" className="gallery-section section-wrap">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">momentos para guardar</p>
            <h2>Un carrete lleno<br />de <em>ella</em></h2>
          </div>
          <p>Desliza, usa las flechas o deja que los recuerdos pasen solitos.</p>
        </div>

        <Carousel
          setApi={setCarouselApi}
          opts={{ align: 'start', loop: true }}
          className="memory-carousel"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
          }}
        >
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem className="memory-slide" key={photo.src}>
                <figure className={index % 2 === 0 ? 'tilt-left' : 'tilt-right'}>
                  <img src={photo.src} alt={photo.alt} loading={index < 3 ? 'eager' : 'lazy'} />
                  <figcaption>{String(index + 1).padStart(2, '0')} / momentos bonitos</figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="carousel-actions">
            <CarouselPrevious className="carousel-arrow prev" />
            <CarouselNext className="carousel-arrow next" />
          </div>
        </Carousel>
      </section>

      <section id="carta" className="letter-section">
        <div className="letter-cloud cloud-a" data-parallax="0.08" />
        <div className="letter-cloud cloud-b" data-parallax="-0.05" />
        <div className="letter-card">
          <Sparkles className="letter-sparkle" aria-hidden="true" />
          <p className="eyebrow">para ti, Mercy</p>
          <h2>Gracias por existir<br />tan <em>bonito</em>.</h2>
          <p>
            Hice este pequeño rincón para que siempre recuerdes lo especial que eres. Para guardar tus sonrisas, tus gustos y todas esas cositas que hacen que seas tú.
          </p>
          <div className="letter-signature">Con mucho amor <Heart fill="currentColor" aria-hidden="true" /></div>
        </div>
      </section>

      <footer>
        <span>Mariela Alejandra Cruz Aguirre</span>
        <Heart fill="currentColor" aria-hidden="true" />
        <span>hecho especialmente para Mercy</span>
      </footer>
    </main>
  );
}
