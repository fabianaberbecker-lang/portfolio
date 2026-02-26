'use client';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { StickerMail } from '@/components/decorative/StickerMail';

function MailIcon() {
    return <StickerMail size={28} color="#ffffff" />;
}

function LinkedInIcon() {
    return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

export default function ContactPage() {
    const { t } = useLanguage();

    const contacts = [
        {
            label: t.contact.emailLabel,
            value: t.hero.email,
            href: `mailto:${t.hero.email}`,
            color: 'bg-pop-red',
            icon: <MailIcon />,
        },
        {
            label: t.contact.linkedinLabel,
            value: 'linkedin.com/in/fabian-becker',
            href: 'https://linkedin.com',
            color: 'bg-pop-purple',
            icon: <LinkedInIcon />,
        },
        {
            label: t.contact.githubLabel,
            value: 'github.com/fabianbecker',
            href: 'https://github.com',
            color: 'bg-pop-green',
            icon: <GitHubIcon />,
        },
    ];

    return (
        <section className="py-20 sm:py-28">
            <Container className="max-w-2xl">
                <h1 className="text-4xl font-black lowercase tracking-tight sm:text-6xl">
                    {t.contact.title}
                </h1>
                <p className="mt-4 text-lg text-muted">
                    {t.contact.subtitle}
                </p>

                <div className="mt-12 space-y-4">
                    {contacts.map((c) => (
                        <a
                            key={c.label}
                            href={c.href}
                            target={c.href.startsWith('http') ? '_blank' : undefined}
                            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="group flex items-center gap-5 rounded-[2rem] border border-border bg-surface p-6 transition-all hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-1"
                        >
                            <div
                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${c.color} text-white transition-transform group-hover:scale-110 group-hover:rotate-3`}
                            >
                                {c.icon}
                            </div>
                            <div>
                                <p className="text-lg font-bold lowercase text-foreground">
                                    {c.label}
                                </p>
                                <p className="text-sm text-muted">{c.value}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* CTA banner */}
                <div className="mt-16 overflow-hidden rounded-[2rem] bg-foreground p-10 text-center text-background">
                    <p className="text-2xl font-black lowercase">{t.contact.preferForm}</p>
                    <p className="mt-2 text-sm text-background/50">
                        {t.contact.formComingSoon}
                    </p>
                    <div className="mt-6">
                        <a href={`mailto:${t.hero.email}`}>
                            <Button variant="cinema" size="lg">
                                {t.contact.sendEmail}
                            </Button>
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
