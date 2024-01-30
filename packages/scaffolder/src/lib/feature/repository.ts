import { Feature } from './feature';

/**
 * Repository-based feature.
 */
class RepositoryFeature extends Feature {
  /**
   * Process a feature and scaffold the files.
   */
  async invoke() {
    console.log('invoking', this);
  }
}

export { RepositoryFeature };
