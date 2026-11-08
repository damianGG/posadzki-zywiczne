/**
 * Opinie przepisane z dostarczonych przez właściciela zrzutów ekranu
 * z 8 listopada 2026. Nie są pobierane ani aktualizowane przez Google API.
 *
 * Nie dopisuj brakujących zdań ani dat. Google Maps jest źródłem weryfikacji.
 */
export const GOOGLE_MAPS_PROFILE_URL = "https://share.google/fiwrzUXA1Fls64tj0";

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  published: string; // data względna dokładnie tak, jak na zrzucie
  excerpt?: boolean; // tylko widoczny fragment tekstu na zrzucie
}

export const googleReviews: GoogleReview[] = [
  {
    id: "karol-kulig",
    author: "Karol Kulig",
    rating: 5,
    published: "7 miesięcy temu",
    content: "Polecam usługi firmy Posadzki Żywiczne Kraków. Dobry kontakt z Właścicielem...",
    excerpt: true,
  },
  {
    id: "evgenii-vilkov",
    author: "Evgenii Vilkov",
    rating: 5,
    published: "9 miesięcy temu",
    content: "Gorąco polecam. Świetna jakość posadzki w bardzo dobrej cenie, a wszystko wykonano w ustalonym wcześniej terminie. Szczególnie doceniam szybki i aktywny kontakt ze strony wykonawcy – rzadko z czymś takim spotykam się :)",
  },
  {
    id: "dominik-burek",
    author: "Dominik Burek",
    rating: 5,
    published: "rok temu",
    content: "Bardzo polecam, szybka realizacja, świetny kontakt i znakomita jakość usług.",
  },
  {
    id: "kacper-zastawnik",
    author: "Kacper Zastawnik",
    rating: 5,
    published: "rok temu",
    content: "",
  },
  {
    id: "kacper-paliwoda",
    author: "Kacper Paliwoda",
    rating: 5,
    published: "rok temu",
    content: "Bardzo polecam firmę ! Profesjonalne podejście, szybka realizacja i świetna jakość wykonania. Posadzka wygląda rewelacyjnie i jest wyjątkowo trwała. Ekipa solidna, terminowa i uprzejma – wszystko na najwyższym poziomie!",
  },
  {
    id: "jakub-zmuda",
    author: "Jakub Żmuda",
    rating: 5,
    published: "rok temu",
    content: "Firma solidna, etyczne wykonanie polecam!",
  },
  {
    id: "bartosz-jesionowski",
    author: "Bartosz Jesionowski",
    rating: 5,
    published: "rok temu",
    content: "",
  },
  {
    id: "mariusz-wlodarz",
    author: "Mariusz Włodarz",
    rating: 5,
    published: "rok temu",
    content: "Polecam firma rzetelna bardzo dobre wykonanie!!!",
  },
];

export const displayedReviewsAverage =
  googleReviews.reduce((total, review) => total + review.rating, 0) / googleReviews.length;
