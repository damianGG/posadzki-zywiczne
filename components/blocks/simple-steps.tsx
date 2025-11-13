import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, FileText, Rocket } from 'lucide-react'

const steps = [
    {
        icon: Phone,
        title: "Umówienie spotkania",
        description: "Zadzwoń do nas, aby umówić się na rozmowę o Twoich potrzebach."
    },
    {
        icon: FileText,
        title: "Propozycja rozwiązania i wycena",
        description: "Przedstawimy Ci nasze propozycje i dokładną wycenę projektu."
    },
    {
        icon: Rocket,
        title: "Realizacja projektu",
        description: "Rozpoczynamy pracę nad Twoim projektem i dostarczamy rezultaty."
    }
]

export default function ProcessSteps() {
    return (
        <section className="container mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Prosty proces w 3 krokach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                    <Card key={index} className="flex flex-col items-center text-center">
                        <CardHeader>
                            <Badge variant="secondary" className="w-12 h-12 rounded-full p-3 mb-4">
                                <step.icon className="w-6 h-6" />
                            </Badge>
                            <CardTitle className="text-xl font-semibold">
                                Krok {index + 1}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

