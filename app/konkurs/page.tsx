"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoveRight, Trophy, Calendar, Instagram, Gift } from "lucide-react";
import { useState } from "react";

export default function KonkursPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/konkurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setSubmitMessage("Dziękujemy za zgłoszenie! Sprawdź swoją skrzynkę email - wysłaliśmy Ci kod do konkursu.");
        setFormData({ name: "", email: "" });
      } else {
        setIsSuccess(false);
        setSubmitMessage(data.message || "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch (error) {
      setIsSuccess(false);
      setSubmitMessage("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column - Contest Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  <Trophy className="w-3 h-3 mr-1" />
                  Konkurs
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-bold">
                  Wygraj 5 000 zł na wykonanie posadzki żywicznej!
                </h1>
                <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                  Marzysz o pięknej posadzce żywicznej? Weź udział w naszym konkursie i wygraj voucher o wartości 5 000 zł na wykonanie posadzki żywicznej!
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <h2 className="text-2xl font-semibold">Jak wziąć udział?</h2>
              <div className="flex flex-row gap-4 items-start text-left">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Wypełnij formularz</p>
                  <p className="text-muted-foreground text-sm">
                    Podaj swoje imię i adres email w formularzu obok
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start text-left">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Otrzymaj kod</p>
                  <p className="text-muted-foreground text-sm">
                    Na podany email otrzymasz unikalny kod uczestnictwa w konkursie
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start text-left">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0">
                  3
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Obserwuj losowanie</p>
                  <p className="text-muted-foreground text-sm">
                    6 grudnia odbędzie się losowanie na żywo na naszym Instagramie
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Ważne daty</h3>
              </div>
              <p className="text-sm text-blue-800">
                <strong>Data losowania:</strong> 6 grudnia 2024
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Instagram className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Losowanie odbędzie się na żywo na naszym profilu Instagram
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4 p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Nagroda</h3>
              </div>
              <p className="text-sm text-green-800">
                Zwycięzca otrzyma voucher o wartości <strong>5 000 zł</strong> na wykonanie posadzki żywicznej przez naszą firmę. Voucher można wykorzystać na dowolną powierzchnię - garaż, kuchnię, balkon czy taras.
              </p>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="justify-center flex items-center">
            <div className="rounded-md max-w-sm w-full flex flex-col border p-8 gap-6 bg-white shadow-lg">
              <div>
                <h2 className="text-2xl font-bold mb-2">Zgłoś się do konkursu</h2>
                <p className="text-sm text-muted-foreground">
                  Wypełnij formularz i weź udział w losowaniu
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="name">Imię *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Twoje imię"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="twoj@email.pl"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Na ten adres wyślemy Twój kod uczestnictwa
                  </p>
                </div>

                {submitMessage && (
                  <div
                    className={`p-4 rounded-md text-sm ${
                      isSuccess
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="gap-2 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wysyłanie..." : "Weź udział w konkursie"}
                  {!isSubmitting && <MoveRight className="w-4 h-4" />}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Przesyłając formularz, wyrażasz zgodę na przetwarzanie danych osobowych w celu uczestnictwa w konkursie.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Results Section - Placeholder for after drawing */}
        <div className="mt-20 pt-20 border-t">
          <div className="flex flex-col gap-4 items-center text-center">
            <Badge variant="outline">Wyniki konkursu</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Wyniki zostaną opublikowane tutaj
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Po zakończeniu losowania 6 grudnia, wyniki konkursu zostaną opublikowane na tej stronie oraz na naszym profilu Instagram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
