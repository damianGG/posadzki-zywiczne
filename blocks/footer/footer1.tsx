import Link from "next/link";
import { serviceGroups } from "@/lib/service-navigation";

export const Footer1 = () => {
  const navigationItems = [
    ...serviceGroups,
    { title: "Informacje", items: [
      {title: "Systemy i producenci", href: "/systemy"},
      {title: "Realizacje", href: "/realizacje"},
      {title: "Galeria zdjęć", href: "/galeria"},
      {title: "Poradniki", href: "/blog"},
      {title: "Kontakt i wycena", href: "/kontakt"},
      {title: "Kalkulator garażu", href: "/kalkulator?typ=garaz"},
    ]},
    { title: "Gdzie wykonujemy posadzki", items: [
      {title: "Rzeszów", href: "/posadzki-zywiczne/rzeszow"},
      {title: "Kraków", href: "/posadzki-zywiczne/krakow"},
      {title: "Lublin", href: "/posadzki-zywiczne/lublin"},
      {title: "Warszawa", href: "/posadzki-zywiczne/warszawa"},
      {title: "Katowice", href: "/posadzki-zywiczne/katowice"},
    ]},
  ];

  return (
    <div className="w-full py-20 lg:py-40 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                PosadzkiZywiczne.Com
              </h2>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                Trwałe posadzki żywiczne dopasowane do obiektu
              </p>
            </div>
            <div className="flex gap-20 flex-row">
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                <p>Rzeszów</p>
                <p>Adres: Podwisłocze 27, 35-309 Rzeszów</p>
                <p>Telefon: 507 384 619</p>
                <p></p>
                <p className="mt-10">Kraków</p>
                <p>Adres: Czyżówka 14, 30-526 Kraków</p>
                <p>Telefon: 507 384 619</p>
              </div>
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                {/* <Link href="/">Terms of service</Link>
                <Link href="/">Privacy Policy</Link> */}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 items-start">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex text-base gap-1 flex-col items-start"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center"
                      >
                        <span className="text-background/75">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
