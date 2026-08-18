'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FooterLink {
	title: string;
	href: string;
	iconClass?: string;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Product',
		links: [
			{ title: 'AI Studio Workspace', href: '/app' },
			{ title: 'Build Fullstack', href: '/product/fullstack' },
			{ title: 'Build Frontend', href: '/product/frontend' },
			{ title: 'PRD / Planning', href: '/product/prd' },
			{ title: 'Galeri Template', href: '/templates' },
		],
	},
	{
		label: 'Resource',
		links: [
			{ title: 'Deploy Cloud Hub', href: '/deploy' },
			{ title: 'GitHub Sync', href: '/github' },
			{ title: 'Testing QA Suite', href: '/testing' },
			{ title: 'Tutorial & Panduan', href: '/tutorial' },
			{ title: 'Connectors & API', href: '/connectors' },
		],
	},
	{
		label: 'Platform',
		links: [
			{ title: 'Paket & Harga', href: '/pricing' },
			{ title: 'Tentang Satusite', href: '/about' },
			{ title: 'Contact Us', href: '/about#contact' },
			{ title: 'Developer & Tim', href: '/about#developer' },
			{ title: 'Portal Proyek', href: '/portal' },
		],
	},
	{
		label: 'Komunitas',
		links: [
			{ title: 'GitHub Repo', href: 'https://github.com', iconClass: 'fa-brands fa-github' },
			{ title: 'Discord Community', href: 'https://discord.com', iconClass: 'fa-brands fa-discord' },
			{ title: 'X (Twitter)', href: 'https://x.com', iconClass: 'fa-brands fa-x-twitter' },
			{ title: 'LinkedIn', href: 'https://linkedin.com', iconClass: 'fa-brands fa-linkedin-in' },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-3xl md:rounded-t-[40px] border-t border-zinc-800/80 bg-[radial-gradient(40%_140px_at_50%_0%,rgba(255,255,255,0.04),transparent)] px-6 py-12 lg:py-16 mt-20 text-zinc-300">
			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-12">
				{/* Brand Column */}
				<AnimatedContainer className="space-y-4 text-left">
					<a href="/" className="flex items-center gap-2.5 group">
						<img
							src="/logo.png"
							alt="satusitE Logo"
							className="w-7 h-7 object-contain transition-transform group-hover:scale-105"
						/>
						<span className="font-agus text-base font-normal tracking-[0.35em] text-white">
							satusitE
						</span>
					</a>
					<p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xs">
						Platform AI Otonom untuk merancang, membangun, dan mengekspor website serta aplikasi fullstack modern siap pakai.
					</p>
					<p className="text-zinc-500 text-xs pt-2">
						© {new Date().getFullYear()} <span className="font-agus font-normal tracking-[0.25em] text-zinc-400">satusitE</span> Studio. All rights reserved.
					</p>
				</AnimatedContainer>

				{/* Navigation Links Columns */}
				<div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4 xl:col-span-2 xl:mt-0 text-left">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-6 sm:mb-0">
								<h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
									{section.label}
								</h3>
								<ul className="space-y-2.5 text-xs text-zinc-400">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-white inline-flex items-center gap-2 transition-colors duration-200"
											>
												{link.iconClass && (
													<i className={`${link.iconClass} w-3.5 text-zinc-400 group-hover:text-white text-center text-xs`} />
												)}
												<span>{link.title}</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export default Footer;
