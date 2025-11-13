import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";

export const Feature3Right = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <Image
          src={"/IMG_3130.jpg"}
          width={608}
          height={342}
          alt="Posadzka żywiczna czyszczenie"
          className="rounded-md  aspect-video h-full flex-1"
        />
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Estetyka
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Posadzki żywiczne pozwalają na stworzenie unikalnych wzorów i kolorów, które można dostosować do stylu balkonu lub tarasu, dodając elegancji i nowoczesności.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-4 w-fit">
            Czytaj więcej o walorach estetycznych <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);
