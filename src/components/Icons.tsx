export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {diagonal
        ? <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

export function TinyStar({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1.5c.8 6.7 3.8 9.7 10.5 10.5-6.7.8-9.7 3.8-10.5 10.5C11.2 15.8 8.2 12.8 1.5 12 8.2 11.2 11.2 8.2 12 1.5Z" fill="currentColor" /></svg>;
}

export function ButtonMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" /><circle cx="18" cy="18" r="2.5" fill="currentColor" /><circle cx="30" cy="18" r="2.5" fill="currentColor" /><circle cx="18" cy="30" r="2.5" fill="currentColor" /><circle cx="30" cy="30" r="2.5" fill="currentColor" /></svg>;
}