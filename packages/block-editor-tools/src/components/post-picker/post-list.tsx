import {
  useCallback, useEffect, useState, JSX,
} from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { Button, TextControl, Spinner } from '@wordpress/components';
import classNames from 'classnames';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Search_Results } from 'wp-types';

import './post-list.scss';
import Post from './post';

interface PostListProps {
  baseUrl: string;
  format?: 'grid' | 'list';
  searchRender?: (post: object) => JSX.Element;
  selected?: number;
  setSelected: (id: number) => void;
  suppressPostIds?: number[];
}

interface Params {
  searchValue: string;
  page: number;
}

/**
 * Displays a list of posts in the post picker modal.
 *
 * @param {obj} atts The attributes of the PostList.
 */
const PostList = ({
  baseUrl,
  format,
  searchRender,
  selected,
  setSelected,
  suppressPostIds = [],
}: PostListProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  // eslint-disable-next-line camelcase
  const [listposts, setListposts] = useState<WP_REST_API_Search_Results>([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pathParams, setPathParams] = useState({
    searchValue: '',
    page: 1,
  });

  /**
   * Gets the posts based on the params.
   *
   * @param {object} params The parameters.
   * @param {bool} cancelled Whether the useEffect has been cancelled.
   * @param {bool} overrideCache Whether we should override the cache.
   */
  const getPosts = useCallback(async (params: Params, cancelled: Boolean = false) => {
    /**
     * Gets the api path.
     *
     * @param {*} params The parameters.
     */
    function getPath() {
      let path = addQueryArgs(
        baseUrl,
        {
          page: params.page,
          _embed: 1,
          exclude: suppressPostIds.join(','),
        },
      );
      if (params.searchValue && params.searchValue.length > 2) {
        path = addQueryArgs(
          path,
          {
            search: params.searchValue,
          },
        );
      }
      return path;
    }

    if (params.searchValue && params.searchValue.length <= 2) {
      return;
    }
    const path = getPath();
    setIsUpdating(true);
    const response = await apiFetch({ path, parse: false });
    setTotalPages(parseInt(
      // @ts-ignore
      response.headers.get('X-WP-TotalPages'),
      10,
    ));
    // @ts-ignore
    const result = await response.json();
    // eslint-disable-next-line camelcase
    let posts = result as any as WP_REST_API_Search_Results;
    if (params.page > 1) {
      posts = [
        ...listposts,
        // eslint-disable-next-line camelcase
        ...result as any as WP_REST_API_Search_Results,
      ];
    }
    if (cancelled) {
      return;
    }
    // @ts-ignore
    // eslint-disable-next-line camelcase
    setListposts(posts as any as WP_REST_API_Search_Results);
    setIsUpdating(false);
  }, [listposts, baseUrl, suppressPostIds]);

  /**
   * Loads more posts.
   */
  const loadMore = () => {
    const newParams = {
      ...pathParams,
      page: pathParams.page + 1,
    };
    setPathParams(newParams);
    getPosts(newParams);
  };

  /**
   * Handles a change to the search text string.
   * @param {event} event - The event from typing in the text box.
   */
  const handleSearchTextChange = (value: string) => {
    const newParams = {
      ...pathParams,
      searchValue: value,
      page: 1,
    };
    setPathParams(newParams);
    getPosts(newParams);
  };

  // Load posts on page load.
  useEffect(() => {
    let cancelled = false;
    if (!initialLoad) {
      setInitialLoad(true);
      getPosts(pathParams, cancelled);
    }
    return () => {
      cancelled = true;
    };
  }, [getPosts, initialLoad, pathParams]);

  const postListClasses = classNames(
    'alley-scripts-post-picker__post-list',
    format === 'list' ? 'is-format-list' : 'is-format-grid',
  );

  return (
    <>
      <TextControl
        className="post-list-search"
        value={pathParams.searchValue}
        placeholder={__('Search...', 'alley-scripts')}
        label={__('Search', 'alley-scripts')}
        // @ts-ignore
        onChange={handleSearchTextChange}
      />
      <div className="alley-scripts-post-picker__container">
        <div className={postListClasses}>
          <h2 id="post-picker-results-heading" className="screen-reader-text">
            {__('Search Results', 'alley-scripts')}
          </h2>
          {listposts ? (
            // eslint-disable-next-line jsx-a11y/no-redundant-roles
            <ul aria-labelledby="post-picker-results-heading" role="list">
              {listposts.map((t) => (
                <li key={t.id}>
                  <Button
                    className={classNames({
                      'alley-scripts-post-picker__post': true,
                      'is-selected': t.id === selected,
                    })}
                    onClick={() => setSelected(t.id as number)}
                  >
                    {searchRender ? (
                      searchRender(t)
                    ) : (
                      <Post
                        format={format}
                        title={t.title}
                        postType={t.subtype}
                          // eslint-disable-next-line no-underscore-dangle
                        attachmentID={t?._embedded?.self[0]?.featured_media}
                      />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
          {isUpdating ? (
            <div className="post-picker-spinner">
              <Spinner onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </div>
          ) : null}
          {totalPages > 0 && pathParams.page < totalPages && !isUpdating ? (
            <div className="alley-scripts-post-picker__load-more">
              <Button
                variant="secondary"
                onClick={loadMore}
              >
                {__('Load More', 'alley-scripts')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PostList;
