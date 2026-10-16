import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post } from 'wp-types';

type EntityRecordOptions = Record<string, unknown>;
type GetEntityRecord<T> = (
  kind: string,
  name: string,
  key: number,
  query?: EntityRecordOptions,
) => T | undefined;

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param postId   The ID for the post to return.
 * @param postType Optional. The post type to select. Default 'post'.
 * @param options  Optional object containing parameters to pass to getEntityRecord.
 * @returns The returned post object, or undefined if it has not resolved yet.
 */
// eslint-disable-next-line camelcase
const usePost = <T extends WP_REST_API_Post = WP_REST_API_Post>(
  postId: number,
  postType: string = 'post',
  options: EntityRecordOptions = { context: 'view' },
): T | undefined => {
  const post = useSelect((select) => {
    const { getEntityRecord }: { getEntityRecord: GetEntityRecord<T> } = select('core');
    return getEntityRecord('postType', postType, postId, options);
  }, [postId, postType]);

  return post;
};

export default usePost;
