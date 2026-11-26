/** Preserve only public calculator parameters, never personal details. */
export function garageCalculatorHref(look?: string | null, area?: string | null) {
  const params = new URLSearchParams({ typ: "garaz" });
  if (look && ["platki", "melanz", "gladka", "kwarc", "doradztwo"].includes(look)) params.set("wyglad", look);
  const meters = area?.trim() ? Number(area.replace(",", ".")) : NaN;
  if (Number.isFinite(meters) && meters >= 1 && meters <= 2500) params.set("metraz", String(meters));
  return "/kalkulator?" + params.toString();
}

export const garageLookLabels: Record<string, string> = {
  platki: "Płatki dekoracyjne",
  melanz: "Szary melanż z płatkami",
  gladka: "Jednolita, gładka powierzchnia",
  kwarc: "Posypka kwarcowa",
};

/** Only preselect an unambiguous match from the actual configured catalogue. */
export function matchGarageSurface(look: string | undefined, options: { id: string; nazwa: string }[]) {
  if (!look) return "";
  const pattern = look === "platki" || look === "melanz" ? /płatk/i
    : look === "kwarc" ? /kwarc/i
    : look === "gladka" ? /gładk|jednolit/i : null;
  if (!pattern) return "";
  const matches = options.filter(option => pattern.test(option.nazwa));
  return matches.length === 1 ? matches[0].id : "";
}
