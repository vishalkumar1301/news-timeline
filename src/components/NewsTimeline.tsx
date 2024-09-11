'use client'

import { useState } from 'react'
import { ChevronRightIcon, Clock, Globe } from 'lucide-react'
import { Article } from '@/lib/Article'
import Image from 'next/image'

export default function NewsTimeline({ articles }: { articles: Article[] }) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const [expandedArticle, setExpandedArticle] = useState<string | null>(null)

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return {
			date: date.getDate().toString(),
			month: date.toLocaleString('default', { month: 'short' }),
		};
	};

	const toggleArticle = (articleId: string) => {
		setExpandedArticle(expandedArticle === articleId ? null : articleId)
	}

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h2 className="text-2xl font-bold mb-6 text-center">News Timeline</h2>
			<div className="space-y-8">
				{articles.map((article, index) => {
					const { date, month } = formatDate(article.publishedAt)
					return (
						<div
							key={index}
							className="flex items-center space-x-4"
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<div className="flex-shrink-0 w-24 text-right">
								<div className="font-bold text-2xl">{date}</div>
								<div className="text-sm text-muted-foreground">{month}</div>
							</div>
							<div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary" />
							<div
								className={`flex-grow p-4 rounded-lg transition-all duration-300 ${
									hoveredIndex === index ? 'bg-muted shadow-lg -translate-y-1' : 'bg-background'
								}`}
							>
								<h3 className="font-semibold text-lg mb-2 flex items-center">
									{article.title}
									<ChevronRightIcon
										className={`ml-2 w-5 h-5 transition-transform duration-300 ${
											hoveredIndex === index ? 'translate-x-1' : ''
										}`}
										onClick={() => toggleArticle(article.url)}
									/>
								</h3>
								<div className="flex items-center text-sm text-muted-foreground mb-2">
									<Clock className="mr-1 h-4 w-4" />
									<time dateTime={article.publishedAt}>
										{new Date(article.publishedAt).toLocaleDateString()}
									</time>
									<span className="mx-2">•</span>
									<Globe className="mr-1 h-4 w-4" />
									<span>{article.sourceId}</span>
								</div>
								{/* {article.urlToImage && (
									<Image
										src={article.urlToImage}
										alt={article.title}
										width={600}
										height={300}
										className="rounded-md mb-4 object-cover w-full"
									/>
								)} */}
								<p className="text-muted-foreground">{article.description}</p>
								{expandedArticle === article.url && (
									<div className="mt-4">
										<p className="mb-4">{article.content}</p>
										<a
											href={article.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block text-primary hover:underline"
										>
											Read full article
										</a>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}