import KalkulatorPosadzki from "@/components/blocks/kalkulator-posadzki";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ typ?: string | string[] }> }) {
    const { typ } = await searchParams
    return <KalkulatorPosadzki presetGarage={typ === "garaz"} />
}
