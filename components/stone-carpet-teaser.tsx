import Link from "next/link"
import { ArrowRight } from "lucide-react"
export default function StoneCarpetTeaser() {
  return <aside className="mx-auto my-10 max-w-5xl rounded-xl border bg-muted/20 p-7">
    <h2 className="mb-2 text-2xl font-semibold">Kamienny dywan na taras i schody</h2>
    <p className="mb-4 text-muted-foreground">Naturalne kruszywo i żywica: zobacz zalety, wady, przykładowy układ warstw oraz informacje o wykonaniu tarasów, balkonów i schodów.</p>
    <Link href="/kamienny-dywan" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">Poznaj ofertę kamiennego dywanu <ArrowRight className="h-4 w-4" /></Link>
  </aside>
}
