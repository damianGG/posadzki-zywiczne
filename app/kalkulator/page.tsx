import KalkulatorPosadzki from "@/components/blocks/kalkulator-posadzki";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ typ?: string | string[]; wyglad?: string | string[] }> }) {
    const { typ, wyglad } = await searchParams
    return <KalkulatorPosadzki presetGarage={typ === "garaz"} presetLook={typeof wyglad === "string" ? wyglad : undefined} />
}
