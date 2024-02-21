import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * getEntityRecord is limited in that it doesn't differentiate between a dirty
 * state and a failed state; it either returns the post or `undefined`. To work
 * around this, we introduce a loading state and use `hasFinishedResolution` to
 * determine if the request has finished and then set the loading state to
 * false. We then change the loading state to true when the arguments change.
 * However, this is still not perfect, as useEffect will not update the loading
 * state until the next render, so we also use state to track the last arguments
 * and compare them to the current arguments to determine if the hook is in a
 * pending state.
 *
 * @param {int}    postId   The ID for the post to return.
 * @param {string} postType Optional. The post type to select. Default 'post'.
 * @returns {EntityRecord} The post EntityRecord on successful resolution, null
 *                         if the request is pending, or undefined if the post
 *                         is not found.
 */
function usePost(postId, postType = 'post') {
  const [lastArgsState, setLastArgsState] = useState(postType);
  const [loading, setLoading] = useState(true);

  const post = useSelect(
    (select) => select('core').getEntityRecord('postType', postType, postId),
    [postId, postType],
  );

  const hasFinishedResolution = useSelect(
    (select) => select('core/data').hasFinishedResolution('core', 'getEntityRecord', [
      'postType',
      postType,
      postId,
    ]),
    [postId, postType],
  );

  useEffect(() => {
    setLoading(true);
  }, [postId, postType]);

  useEffect(() => {
    setLastArgsState({ postId, postType });
  }, [postId, postType]);

  useEffect(() => {
    if (hasFinishedResolution) {
      setLoading(false);
    }
  }, [hasFinishedResolution]);

  return (
    postType === null
    || postId === null
    || loading
    || postId !== lastArgsState.postId
    || postType !== lastArgsState.postType
  ) ? null : post;
}

export default usePost;
