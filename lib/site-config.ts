// Shared production URLs and business details used by metadata and structured data.
export const SITE_URL = "https://www.posadzkizywiczne.com";

export const SITE_NAME = "Posadzki Żywiczne";

export const SITE_DESCRIPTION =
  "Wykonujemy posadzki żywiczne w garażach, domach, lokalach usługowych i halach oraz na balkonach i tarasach. Rzeszów, Kraków i okolice. Zapytaj o wycenę.";

export const SITE_PHONE = "+48507384619";
export const SITE_EMAIL = "biuro@posadzkizywiczne.com";

export const SITE_LOCATIONS = [
  {
    name: "Posadzki Żywiczne Rzeszów",
    streetAddress: "Podwisłocze 27",
    addressLocality: "Rzeszów",
    addressCountry: "PL",
  },
  {
    name: "Posadzki Żywiczne Kraków",
    streetAddress: "Czyżówka 14",
    addressLocality: "Kraków",
    addressCountry: "PL",
  },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
