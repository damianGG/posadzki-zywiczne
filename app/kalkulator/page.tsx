import KalkulatorPosadzki from "@/components/blocks/kalkulator-posadzki";
import { isShopEnabled } from "@/lib/shop-feature";

export const dynamic = "force-dynamic";

export default function Page() {
    return <KalkulatorPosadzki shopEnabled={isShopEnabled()} />
}
