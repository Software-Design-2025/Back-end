import { Composition } from 'remotion';
import RemotionComposition from './Composition';

type Caption = {
  start: number;
  end: number;
  text?: string;
};

const RemotionRoot = () => {
  return (
    <Composition
      id="Empty"
      component={RemotionComposition}
      durationInFrames={60}
      fps={30}
      width={600}
      height={340}
      defaultProps={{
        durationInFrames: 60,
        script: '',
        audioFileUrl: '',
        captions: [],
        imageList: [],
        fontSize: 32,
        fontFamily: 'Bungee',
        color: '#fff',
        animationType: 'fade',
        bgAnimationType: 'fade',
        musicFile: null,
        sticker: null,
        stickerWidth: 64,
        stickerHeight: 64,
        width: 600,
        height: 340,
      }}
      calculateMetadata={async ({ props }: { props: Record<string, unknown> }) => {
        const captions = Array.isArray(props.captions) ? (props.captions as Caption[]) : [];
        const width = typeof props.width === 'number' ? props.width : 600;
        const height = typeof props.height === 'number' ? props.height : 340;

        if (captions.length === 0) {
          return { durationInFrames: 60, width, height };
        }

        let lastEnd = captions[captions.length - 1]?.end || 2000;
        if (lastEnd < 1000) {
          lastEnd = lastEnd * 1000;
        }

        const fps = 30;
        const durationInFrames = Math.round((lastEnd / 1000) * fps);

        return { durationInFrames, width, height };
      }}
    />
  );
};

export default RemotionRoot;
