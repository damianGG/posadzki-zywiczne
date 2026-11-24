import KalkulatorPosadzki from "@/components/blocks/kalkulator-posadzki";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ typ?: string | string[]; wyglad?: string | string[]; metraz?: string | string[] }> }) {
    const { typ, wyglad, metraz } = await searchParams
    const area = typeof metraz === "string" && metraz.trim() ? Number(metraz.replace(",", ".")) : NaN
    const presetArea = typ === "garaz" && Number.isFinite(area) && area >= 1 && area <= 2500 ? area : undefined
    return <KalkulatorPosadzki presetGarage={typ === "garaz"} presetArea={presetArea} presetLook={typeof wyglad === "string" ? wyglad : undefined} />
}
