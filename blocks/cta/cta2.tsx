import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const CTA2 = () => (
  <div className="w-full py-20 lg:py-20 bg-muted">
    <div className="container mx-auto">
      <div className="flex flex-col text-center py-14 gap-4 items-center">
        <div>
          {/* <Badge>Get started</Badge> */}
        </div>
        <div className="flex flex-col  gap-2">
          <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            Potrzebujesz więcej informacji?
          </h3>
          <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
            Jeśli potrzebujesz więcej informacji zadzwoń lub napisz bezpośrednio do nas, odpowiemy w ciągu 3 godzin.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <Button className="gap-4" variant="outline">
            <a href="tel:+48507384619">+48 507 384 619</a><PhoneCall className="w-4 h-4" />
          </Button>

          <Button className="gap-4">
            <a href="mailto:biuro@posadzkizywiczne.com">biuro@posadzkizywiczne.com</a>
            <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);
