'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

const NewsCard = () => {
  const [fetchedarticle, setfetchedarticle] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true); // Initially assume there are more
  const fetchedUrls = useRef(new Set());

  const fetchInitialArticles = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const resp = await axios.get(`/api/allnews`);
      if (resp.data?.data?.articles) {
        setfetchedarticle(resp.data.data.articles);
        resp.data.data.articles.forEach(article => fetchedUrls.current.add(article.url));
      }
    } catch (error) {
      console.error("Error fetching initial articles:", error);
      setError("Failed to fetch initial articles.");
      setHasMore(false); // Set hasMore to false on initial load error
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const fetchMoreArticles = useCallback(async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setError(null);
      try {
        const resp = await axios.get(`/api/allnews`);
        if (resp.data?.data?.articles) {
          const latestArticles = resp.data.data.articles;
          const newDistinctArticles = latestArticles.filter(
            (article) => !fetchedUrls.current.has(article.url)
          );

          if (newDistinctArticles.length > 0) {
            setfetchedarticle(prev => [...prev, ...newDistinctArticles]);
            newDistinctArticles.forEach(article => fetchedUrls.current.add(article.url));
            // We assume there might be more articles, so we keep hasMore true
          }
        }
      } catch (error) {
        console.error("Error fetching more articles:", error);
        setError("Failed to fetch more articles.");
        setHasMore(false); // Set hasMore to false if there's an error fetching
      } finally {
        setLoadingMore(false);
      }
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    fetchInitialArticles();
  }, [fetchInitialArticles]);

  useEffect(() => {
    const handlescroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      if (scrollTop + clientHeight >= scrollHeight - 200 && !loadingMore && hasMore) {
        fetchMoreArticles();
      }
    };

    window.addEventListener('scroll', handlescroll);
    return () => window.removeEventListener('scroll', handlescroll);
  }, [fetchMoreArticles, loadingMore, hasMore]);

  const formatDateAndHoursAgo = (dateString) => {
    if (!dateString) {
      return 'Published: Unknown';
    }
    const publishedDate = new Date(dateString);
    const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
    const formattedDate = publishedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `Published: ${formattedDate} (${timeAgo})`;
  };

  return (
    <article className=" rounded-md shadow-md overflow-hidden">
      <div className='flex items-center justify-around gap-2 flex-wrap w-full'>
        {initialLoading ? (
          <div className='flex items-center justify-around gap-2 flex-wrap w-full'>
            {Array(8).fill(null).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[450px]     w-[300px] rounded-3xl" />
                {/* <div className="space-y-2"> */}
                  {/* <Skeleton className="h-4 bg-neutral-800 w-[250px]" />
                  <Skeleton className="h-4 bg-neutral-800 w-[200px]" /> */}
                {/* </div> */}
              </div>
            ))}
          </div>
        ) : Array.isArray(fetchedarticle) ? (
          <>
            {fetchedarticle.map((e) => (
              <div className='w-[300px] group rounded-md border shadow hover:shadow-md shadow-neutral-800 border-neutral-900' key={e?.url}>
                <Link href={e?.url} target='_blank' aria-label={`Read full article: ${e?.title}`}>
                  <div className="relative max-w-full h-56 sm:h-64">
                    {e?.image && (
                      <Image
                        src={e?.image}
                        alt={e?.title}
                        layout="fill"
                        objectFit="contain"
                        className="hover:opacity-90 transition-opacity duration-200 rounded-xl"
                      />
                    )}
                    <div className="absolute rounded-sm bottom-10 left-0 bg-black/40 backdrop-blur-md font-bold text-white p-2 text-sm">
                      <span>{e?.source}</span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-neutral-400 mb-2">
                    <span
                     
                      className="group-hover:text-white transition-colors duration-200"
                   
                    >
                      {e?.title}
                    </span>
                  </h2>
                  <p className="text-neutral-300  text-sm mb-3 line-clamp-16">{e?.text}</p>
                  <div className="flex justify-between items-center text-gray-500 text-xs">
                    <span>
                      Published: {formatDateAndHoursAgo(e?.publishedAt)}
                    </span>
                    <Link
                      target='_blank'
                      href={e?.url}
                      className="text-blue-500 hover:underline font-semibold text-nowrap"
                      aria-label={`Read full article on ${e?.source}`}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {loadingMore && (
              <div className='flex items-center justify-around gap-2 flex-wrap w-full'>
                {Array(20).fill(null).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px]   bg-neutral-900   w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      {/* <Skeleton className="h-4 bg-neutral-800 w-[250px]" />
                      <Skeleton className="h-4 bg-neutral-800 w-[200px]" /> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </article>
  );
};

export default NewsCard;