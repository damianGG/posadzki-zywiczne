import Link from "next/link";

export const Footer1 = () => {
  const navigationItems = [
    {
      title: "",
      href: "/",
      description: "",
    },
    {
      title: "",
      description: "",
      items: [
        {
          title: "",
          href: "/reports",
        },
        {
          title: "",
          href: "/statistics",
        },
        {
          title: "",
          href: "/dashboards",
        },
        {
          title: "",
          href: "/recordings",
        },
      ],
    },
    {
      title: "Firma",
      description: "Wytrzymałe, odporno posadzki żywiczne",
      items: [
        {
          title: "Stronga główna",
          href: "/",
        },
        {
          title: "Balkony i tarasy",
          href: "/posadzki-zywiczne-na-balkony",
        },
        {
          title: "Garaże",
          href: "/garaze",
        },
        {
          title: "Pomieszczenia czyste",
          href: "/pomieszczenia-czyste",
        },
        {
          title: "Kuchnia i Salon",
          href: "/kuchnia-salon",
        },
      ],
    },
  ];

  return (
    <div className="w-full py-20 lg:py-40 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Posadzki Żywiczne
              </h2>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                Wytrzymałe, odporno posadzki żywiczne
              </p>
            </div>
            <div className="flex gap-20 flex-row">
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                <p>Sędziszów Młp</p>
                <p>Warszawska 72</p>
              </div>
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                {/* <Link href="/">Terms of service</Link>
                <Link href="/">Privacy Policy</Link> */}
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex text-base gap-1 flex-col items-start"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-xl">{item.title}</p>
                  )}
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
