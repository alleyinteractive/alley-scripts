import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  JSX,
} from 'react';
import styled, { css } from 'styled-components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { Button, TextControl, Spinner } from '@wordpress/components';
import classNames from 'classnames';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Search_Results } from 'wp-types';

import Post from './post';

interface PostListProps {
  baseUrl: string;
  filters?: React.ReactNode;
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

const Container = styled.div`
  // Allow space for focus state.
  margin: 0 -0.5rem;
  overflow-y: auto;
  padding: 0 0.5rem;
`;

const Wrapper = styled.div<{ $format?: string; }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-bottom: 2rem;
  gap: 0.5rem;
  width: 100%;

  ${(props) => props.$format === 'grid'
    && css`
      ul {
        grid-template-columns: repeat(2, 1fr);

        @media (min-width: 600px) {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (min-width: 1024px) {
          grid-template-columns: repeat(5, 1fr);
        }
      }
    `};
`;

const List = styled.ul`
  display: grid;
  grid-gap: 0.5rem;
  list-style: none;
  margin: 0.5rem 0;
  padding: 0;
  width: 100%;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0;
`;

const StyledButton = styled(Button) <{ $format?: string }>`
  align-items: flex-start;
  border: 1px solid #eee;
  color: #1e1e1e;
  height: 100%;
  padding: 0.8rem;
  text-align: left;
  transition: background-color 0.2s ease-in-out;
  width: 100%;

  // Increase specificity to override core.
  &&:hover {
    background-color: #f0f0f0;
    color: #1e1e1e;
  }

  &.is-selected {
    background-color: #f0f0f0;
  }

  ${(props) => props.$format === 'list'
    && css`
      display: flex;
      justify-content: flex-start;
      width: 100%;
    `};
`;

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  height: 2.25rem;
  justify-content: center;
  padding: 0.5rem 0 0;
`;

const LoadMore = styled.div`
  clear: both;
  float: left;
  text-align: center;
  width: 100%;
`;

/**
 * Displays a list of posts in the post picker modal.
 *
 * @param {obj} atts The attributes of the PostList.
 */
const PostList = ({
  baseUrl,
  filters,
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
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Gets the posts based on the params.
   *
   * @param {object} params The parameters.
   */
  const getPosts = useCallback(async (params: Params) => {
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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (params.searchValue && params.searchValue.length <= 2) {
      setIsUpdating(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const path = getPath();
    setIsUpdating(true);

    let response: Response;
    let result: unknown;
    try {
      response = await apiFetch<Response>({
        path,
        parse: false,
        signal: abortController.signal,
      });

      result = await response.json();
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }
      throw error;
    }

    setTotalPages(parseInt(
      // @ts-ignore
      response.headers.get('X-WP-TotalPages'),
      10,
    ));
    // eslint-disable-next-line camelcase
    let posts = result as any as WP_REST_API_Search_Results;
    if (params.page > 1) {
      posts = [
        ...listposts,
        // eslint-disable-next-line camelcase
        ...result as any as WP_REST_API_Search_Results,
      ];
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
    if (!initialLoad) {
      setInitialLoad(true);
      getPosts(pathParams);
    }
  }, [getPosts, initialLoad, pathParams]);

  /*
   * Cancel the pending request when the modal closes. The modal unmounts this
   * component when it closes, and React calls the returned cleanup function
   * only on unmount because the dependency array is empty. The cleanup reads
   * the ref when it runs, so it cancels the newest request.
   */
  useEffect(() => {
    const cancelPendingRequest = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    return cancelPendingRequest;
  }, []);

  useEffect(() => {
    handleSearchTextChange(pathParams.searchValue);
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterDiv = useRef<HTMLDivElement>(null);
  const modalHeight = window.innerWidth < 600 ? '95vh' : '70vh';
  return (
    <>
      <TextControl
        value={pathParams.searchValue}
        placeholder={__('Search...', 'alley-scripts')}
        label={__('Search', 'alley-scripts')}
        // @ts-ignore
        onChange={handleSearchTextChange}
      />
      {filters ? <div ref={filterDiv}>{filters}</div> : null}
      <Container style={{ height: filterDiv.current?.offsetHeight ? `calc(${modalHeight} - ${filterDiv.current?.offsetHeight}px - 254px)` : `calc(${modalHeight} - 254px)` }}>
        <Wrapper $format={format}>
          <h2 id="post-picker-results-heading" className="screen-reader-text">
            {__('Search Results', 'alley-scripts')}
          </h2>
          {listposts ? (
            // eslint-disable-next-line jsx-a11y/no-redundant-roles
            <List aria-labelledby="post-picker-results-heading" role="list">
              {listposts.map((t) => (
                <ListItem key={t.id}>
                  <StyledButton
                    className={classNames({
                      'is-selected': t.id === selected,
                    })}
                    onClick={() => setSelected(t.id as number)}
                    $format={format}
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
                  </StyledButton>
                </ListItem>
              ))}
            </List>
          ) : null}
          {isUpdating ? (
            <SpinnerContainer>
              <Spinner onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </SpinnerContainer>
          ) : null}
          {totalPages > 0 && pathParams.page < totalPages && !isUpdating ? (
            <LoadMore>
              <Button
                variant="secondary"
                onClick={loadMore}
              >
                {__('Load More', 'alley-scripts')}
              </Button>
            </LoadMore>
          ) : null}
        </Wrapper>
      </Container>
    </>
  );
};

export default PostList;
