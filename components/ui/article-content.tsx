import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

interface ArticleContentProps {
    title: string;
    subtitle?: string;
    category: string;
    content: string[];
    images?: {
        src: string;
        alt: string;
    }[];
}

export const ArticleContent = ({
    title,
    subtitle,
    category,
    content,
    images
}: ArticleContentProps) => {
    return (
        <article className="w-full py-8 lg:py-12">
            <div className="container mx-auto max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Badge variant="outline" className="w-fit">{category}</Badge>

                    <h2 className="text-2xl md:text-4xl tracking-tighter font-medium">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-lg text-muted-foreground">
                            {subtitle}
                        </p>
                    )}

                    <div className="prose prose-lg max-w-none">
                        {content.map((paragraph, index) => (
                            <p key={index} className="mb-4 text-base leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {images && images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {images.map((image, index) => (
                                <div key={index} className="relative aspect-video">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}; 