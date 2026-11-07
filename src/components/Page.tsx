import { useEffect, useRef, type ReactNode } from 'react';

type Props = { title: string; description: string; className?: string; children: ReactNode };

export function Page({ title, description, className = '', children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${title} | Izzy Moonbow`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !ref.current) return;
      const gsap = gsapModule.gsap;
      gsap.registerPlugin(triggerModule.ScrollTrigger);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 20,
            duration: 0.65,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: { trigger: element, start: 'top 93%', once: true },
          });
        });
      }, ref.current);
      revert = () => context.revert();
    }).catch(() => { /* Content stays visible if animation cannot load. */ });
    return () => { cancelled = true; revert?.(); };
  }, []);

  return <div ref={ref} className={`page ${className}`}>{children}</div>;
}