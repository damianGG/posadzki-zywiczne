"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { serviceGroups } from "@/lib/service-navigation";

const links = [
  { title: "Realizacje", href: "/realizacje" },
  { title: "Poradniki", href: "/blog" },
  { title: "Kontakt", href: "/kontakt" },
];

export const Header2 = () => {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  const active = (href: string) => pathname === href ? "page" as const : undefined;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-zinc-50" onKeyDown={event => {
      if (event.key === "Escape" && isOpen) { setOpen(false); toggleRef.current?.focus(); }
    }}>
      <div className="container mx-auto flex min-h-20 items-center justify-between gap-3">
        <Link href="/" aria-label="PosadzkiŻywiczne.com — strona główna" className="flex shrink-0 items-center gap-2">
          <Image src="/posadzkizywiczne.com_logo.png" alt="" width={32} height={32} sizes="32px" />
          <span className="hidden text-lg font-bold sm:block">PosadzkiŻywiczne.com</span>
        </Link>
        <div className="hidden xl:block">
          <NavigationMenu aria-label="Nawigacja główna">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Posadzki</NavigationMenuTrigger>
                <NavigationMenuContent className="p-6 md:w-[600px]">
                  <div className="grid grid-cols-2 gap-6">
                    {serviceGroups.map(group => (
                      <div key={group.title}>
                        <p className="mb-3 text-sm font-semibold text-muted-foreground">{group.title}</p>
                        <ul className="space-y-1">{group.items.map(item => (
                          <li key={item.href}><NavigationMenuLink asChild active={pathname === item.href}>
                            <Link href={item.href} aria-current={active(item.href)} className="block rounded-md px-3 py-2 text-sm hover:bg-muted focus:bg-muted">{item.title}</Link>
                          </NavigationMenuLink></li>
                        ))}</ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {links.map(item => (
                <NavigationMenuItem key={item.href}><NavigationMenuLink asChild active={pathname === item.href}>
                  <Link href={item.href} aria-current={active(item.href)} className="block rounded-md px-4 py-2 text-sm font-medium hover:bg-muted">{item.title}</Link>
                </NavigationMenuLink></NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/kalkulator" className="hidden text-sm hover:underline lg:block">Kalkulator garażu</Link>
          <Button asChild size="sm"><Link href="/kalkulator">Wyceń garaż</Link></Button>
          <Button ref={toggleRef} variant="ghost" size="icon" className="xl:hidden" aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <nav id="mobile-navigation" aria-label="Nawigacja mobilna" hidden={!isOpen} className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t px-5 py-4 xl:hidden">
        <p className="mb-3 text-lg font-semibold">Posadzki</p>
        {serviceGroups.map(group => (
          <details key={group.title} open className="mb-4 border-b pb-3">
            <summary className="cursor-pointer py-2 font-medium">{group.title}</summary>
            <ul>{group.items.map(item => (
              <li key={item.href}><Link href={item.href} aria-current={active(item.href)} onClick={() => setOpen(false)} className="block rounded px-3 py-3 text-sm hover:bg-muted">{item.title}</Link></li>
            ))}</ul>
          </details>
        ))}
        {links.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href)} onClick={() => setOpen(false)} className="block py-3 font-medium">{item.title}</Link>)}
        <Link href="/kalkulator" onClick={() => setOpen(false)} className="block py-3 font-medium">Kalkulator garażu</Link>
      </nav>
    </header>
  );
};
