/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __, sprintf } from '@wordpress/i18n';
import { Button, Spinner } from '@wordpress/components';
import classNames from 'classnames';
import type { WP_REST_API_Search_Results } from 'wp-types';

import './post-list.scss';

interface PostListProps {
  baseUrl: string;
  selected?: string | number;
  setSelected: (id: string | number) => void;
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
  selected,
  setSelected,
}: PostListProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
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
  const getPosts = useCallback((params: Params, cancelled: Boolean = false) => {
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
    apiFetch({ path, parse: false }).then((response) => {
      setTotalPages(parseInt(
        // @ts-ignore
        response.headers.get('X-WP-TotalPages'),
        10,
      ));
      // @ts-ignore
      return response.json();
    }).then((result) => {
      let posts = result as any as WP_REST_API_Search_Results;
      if (params.page > 1) {
        posts = [
          ...listposts,
          ...result as any as WP_REST_API_Search_Results,
        ];
      }
      if (cancelled) {
        return;
      }
      // @ts-ignore
      setListposts(posts as any as WP_REST_API_Search_Results);
      setIsUpdating(false);
    });
  }, [listposts, baseUrl]);

  /**
   * Loads more posts.
   */
  function loadMore() {
    const newParams = {
      ...pathParams,
      page: pathParams.page + 1,
    };
    setPathParams(newParams);
    getPosts(newParams);
  }

  /**
   * Handles a change to the search text string.
   * @param {event} event - The event from typing in the text box.
   */
  function handleSearchTextChange(event: Event) {
    const {
      target: {
        // @ts-ignore
        value = '',
      } = {},
    } = event;

    const newParams = {
      ...pathParams,
      searchValue: value,
      page: 1,
    };
    setPathParams(newParams);
    getPosts(newParams);
  }

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

  return (
    <>
      <input
        type="text"
        value={pathParams.searchValue}
        placeholder={__('Search...', 'alley-scripts')}
        label={__('Search', 'alley-scripts')}
        // @ts-ignore
        onChange={handleSearchTextChange}
      />
      <div className="alley-scripts-post-picker__post-list">
        {listposts ? (
          listposts.map((t) => (
            <Button
              key={t.id}
              className={classNames({
                'alley-scripts-post-picker__post': true,
                'is-selected': t.id === selected,
              })}
              onClick={() => setSelected(t.id)}
            >
              <div>
                <strong>
                  {t.title}
                </strong>
                {sprintf(
                  ' (%s)',
                  t.subtype,
                )}
              </div>
            </Button>
          ))
        ) : null}
        {isUpdating ? (
          <Spinner />
        ) : null}
        {totalPages > 0 && pathParams.page < totalPages ? (
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
    </>
  );
};

export default PostList;
