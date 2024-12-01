import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

export const Feature4 = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 flex-col flex-1">
          <div>
            <Badge>Porozmawiajmy</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Zadzwoń, pomożemy.
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Masz pytania dotyczące posadzek żywicznych lub potrzebujesz porady? Skontaktuj się z nami, a doradzimy Ci najlepsze rozwiązanie dla Ciebie.
            </p>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              + 48 123 123 123

            </p>


          </div>
        </div>
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
      </div>
    </div>
  </div>
);
