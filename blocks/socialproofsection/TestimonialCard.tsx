import Image from "next/image"
import { Star } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialCardProps {
    testimonial: {
        content: string
        author: string
        position: string
        rating: number
        image: string
    }
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className="h-full">
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                    <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                    <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

