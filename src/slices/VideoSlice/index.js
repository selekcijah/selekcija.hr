import { YouTubeEmbed } from "./YouTubeEmbed";
import { Section } from "@/components/ui/Section";

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * @typedef {import("@prismicio/client").Content.VideoSliceSlice} VideoSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<VideoSliceSlice>} VideoSliceProps
 * @type {import("react").FC<VideoSliceProps>}
 */
const VideoSlice = ({ slice }) => {
  const { primary } = slice;
  const videoId = extractYouTubeId(primary.youtube_url);

  if (!videoId) return null;

  return (
    <Section padding="tight" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      {primary.title && <h2 className="mb-6 font-heading text-[28px] font-bold text-ink md:text-[36px]">{primary.title}</h2>}
      <YouTubeEmbed videoId={videoId} title={primary.title || "Video"} />
      {primary.caption && <p className="mt-4 text-[14px] text-muted">{primary.caption}</p>}
    </Section>
  );
};

export default VideoSlice;
