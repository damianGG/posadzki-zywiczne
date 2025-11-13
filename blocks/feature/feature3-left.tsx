import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from 'next/image';

export const Feature3left = () => (
  <div className="w-full py-20 lg:py-0">
    <div className="container mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Łatwość w utrzymaniu czystości
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Powierzchnia żywiczna jest gładka i nieporowata, co znacznie ułatwia jej czyszczenie i ogranicza gromadzenie się brudu oraz pleśni.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-4 w-fit">
            Czytaj więcej o utrzymaniu czystości posadzek żywicznych<MoveRight className="w-4 h-4" />
          </Button>
        </div>
        <Image
          src={"/sprzatanie-balokonu-2.jpg"}
          width={608}
          height={342}
          alt="Posadzka żywiczna czyszczenie"
          className="rounded-md w-full aspect-video h-full flex-1"
        />

      </div>
    </div>
  </div>
);
