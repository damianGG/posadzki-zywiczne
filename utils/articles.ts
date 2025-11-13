import { Article, articles } from '@/data/articles';

export const getRelatedArticles = (currentArticleId: string, category: string, limit = 3): Article[] => {
  return Object.values(articles)
    .filter(article => 
      article.id !== currentArticleId && 
      (article.category === category || article.tags.includes(category))
    )
    .slice(0, limit);
}; 