export const SITE_URL = "https://www.posadzkizywiczne.com";

export const SITE_NAME = "Posadzki Żywiczne";

export const SITE_DESCRIPTION =
  "Wykonujemy trwałe i estetyczne posadzki żywiczne w garażach, kuchniach, łazienkach, piwnicach, halach oraz na balkonach i tarasach.";

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
