'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Article } from '@/lib/Article'
import { ChevronDown, ChevronUp, Clock, Globe } from 'lucide-react'

export default function NewsTimeline({ articles }: { articles: Article[] }) {
    const [expandedArticle, setExpandedArticle] = useState<string | null>(null)

    const toggleArticle = (articleId: string) => {
        setExpandedArticle(expandedArticle === articleId ? null : articleId)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-8">
            {articles.map((article, index) => (
                <div key={index} className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                    <div className="pl-8 relative">
                        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                        <div className="bg-card rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-semibold line-clamp-2">{article.title}</h2>
                                    <button
                                        onClick={() => toggleArticle(article.url)}
                                        className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {expandedArticle === article.url ? (
                                            <ChevronUp className="h-5 w-5" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <time dateTime={article.publishedAt}>
                                        {formatDate(article.publishedAt)}
                                    </time>
                                    <span className="mx-2">•</span>
                                    <Globe className="mr-1 h-4 w-4" />
                                    <span>{article.source.id}</span>
                                </div>
                                {article.urlToImage && (
                                    <Image
                                        src={article.urlToImage}
                                        alt={article.title}
                                        width={600}
                                        height={300}
                                        className="rounded-md mb-4 object-cover w-full"
                                    />
                                )}
                                <p className="text-muted-foreground line-clamp-3">{article.description}</p>
                            </div>
                            {expandedArticle === article.url && (
                                <div className="p-4 border-t border-border">
                                    <p className="mb-4">{article.content}</p>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block text-primary hover:underline"
                                    >
                                        Read full article
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}