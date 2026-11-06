import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceGroups } from "@/lib/service-navigation";

export const Feature5 = () => (
  <section className="container mx-auto py-16 lg:py-24" aria-labelledby="services-heading">
    <h2 id="services-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">Dobierz posadzkę do swojego obiektu</h2>
    <p className="mt-4 max-w-2xl text-muted-foreground">Wybierz zastosowanie. Pokażemy, co uwzględnić przy doborze posadzki i jakie informacje przygotować do wyceny.</p>
    {serviceGroups.map(group => (
      <div key={group.title} className="mt-10">
        <h3 className="mb-5 text-2xl font-semibold">{group.title}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map(item => (
            <Link key={item.href} href={item.href} className="group rounded-xl border bg-background p-6 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <h4 className="flex items-center justify-between gap-3 text-lg font-semibold">{item.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    ))}
  </section>
);
