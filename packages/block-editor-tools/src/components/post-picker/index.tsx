import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

interface PostPickerProps {
  allowedTypes: string[];
  className: string;
  icon: string;
  onReset: () => void;
  onUpdate: (id: number) => void;
  value: number;
}

// Styled components.
const Container = styled.div`
  display: block;
  position: relative;
`;

const PostPicker = ({
  allowedTypes,
  className,
  icon,
  onReset,
  onUpdate,
  value,
}: PostPickerProps) => {
  // Get the post object, if given the post ID.
  const {
    post = null,
  } = useSelect((select) => ({
    // @ts-ignore
    post: value ? select('core').getEntityRecord(value) : null,
  }), [value]);

  // getEntityRecord returns `null` if the load is in progress.
  if (value !== 0 && post === null) {
    return (
      <Spinner />
    );
  }

  const controls = () => {
    return (
      <Button
        variant="primary"
        onClick={onReset}
      >
        {__('Replace', 'alley-scripts')}
      </Button>
    );
  };

  if (value) {
    return (
      <Container className={className}>
        {controls()}
      </Container>
    );
  }

  return (
    <Container className={className}>
      test
    </Container>
  );
};

PostPicker.defaultProps = {
  allowedTypes: [],
  className: '',
  icon: 'format-aside',
};

PostPicker.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  icon: PropTypes.string,
  onReset: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default PostPicker;
