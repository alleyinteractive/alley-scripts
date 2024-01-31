import cliProgress from 'cli-progress';
import simpleGit from 'simple-git';

let currentStage: string | undefined;
let bar: cliProgress.SingleBar | undefined;

/**
 * Update the progress bar to support multiple stages.
 */
const updateBar = (stage: string, progress: number) => {
  if (currentStage && currentStage !== stage) {
    bar?.stop();
    bar = undefined;
  }

  currentStage = stage;

  if (!bar) {
    bar = new cliProgress.SingleBar({
      clearOnComplete: true,
      format: `${stage} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
      stopOnComplete: true,
    }, cliProgress.Presets.shades_classic);

    bar.start(100, progress);
  } else {
    bar.update(progress);
  }
};

/**
 * Retrieve the git instance
 *
 * @todo All the configuration to specify git options.
 */
export const createGit = (directory?: string) => simpleGit({
  baseDir: directory,
  binary: process.env.GIT_BINARY || 'git',
  progress({ stage, progress }) {
    updateBar(stage, progress);
  },
});
