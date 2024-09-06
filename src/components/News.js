import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = ({
    setProgress = () => {},
    apiKey = '',
    pageSize = 8,
    country = 'in',
    category = 'general'
}) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const updateNews = async () => {
        try {
            setProgress(10);
            const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
            setLoading(true);
            let data = await fetch(url);
            setProgress(30);
            let parsedData = await data.json();
            setProgress(70);
            setArticles(parsedData.articles || []);
            setTotalResults(parsedData.totalResults || 0);
            setLoading(false);
            setProgress(100);
        } catch (error) {
            console.error("Error fetching news:", error);
            setLoading(false);
            setProgress(100);
        }
    };

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(category)} - NewsMania`;
        updateNews();
        // eslint-disable-next-line
    }, [category, page]);

    const fetchMoreData = async () => {
        try {
            const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${pageSize}`;
            setPage(page + 1);
            let data = await fetch(url);
            let parsedData = await data.json();
            setArticles(prevArticles => (parsedData.articles ? prevArticles.concat(parsedData.articles) : prevArticles));
            setTotalResults(parsedData.totalResults || 0);
        } catch (error) {
            console.error("Error fetching more news:", error);
        }
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
                NewsMania - Top {capitalizeFirstLetter(category)} Headlines
            </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => (
                            <div className="col-md-4" key={element.url}>
                                <NewsItem
                                    title={element.title || ""}
                                    description={element.description || ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source?.name || ""}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
};

News.propTypes = {
    setProgress: PropTypes.func,
    apiKey: PropTypes.string,
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string,
};

export default News;
