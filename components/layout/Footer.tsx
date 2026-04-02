import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '#', label: 'Бидний тухай' },
  { href: '#', label: 'Нууцлалын бодлого' },
  { href: '#', label: 'Үйлчилгээний нөхцөл' },
  { href: '#', label: 'Тусламж' },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-outline-variant/20 bg-surface-container-low/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ds-primary/30 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-14 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="Peony лого"
              width={56}
              height={56}
            />
            <span className="heading-section text-base font-bold text-on-background">
              Peony
            </span>
          </div>
          <p className="text-sm text-on-surface-variant/60">
            © 2025 Peony. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-on-surface-variant/70 transition-colors duration-300 hover:text-ds-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
