import type { Media } from "@/lib/puppies";

// The showroom pup the home page uses for the shopfront window and the chat
// photos/video. These clips aren't attached to a listing, so they live here.
const photo = (id: string, file: string, alt: string, focalX: number, focalY: number, color = "#685848"): Media => ({
  id,
  url: `/media/${id}/${file}`,
  kind: "image",
  width: 1080,
  height: 1920,
  alt,
  caption: "",
  focalX,
  focalY,
  color,
  blurDataUrl: null,
  durationS: null,
  poster: null,
});

export const showroomPhotos: Media[] = [
  photo("FHyoHcIosLZE", "60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg", "A tiny apricot teddy bear puppy held up in the TeddyPups showroom", 0.543, 0.483),
  photo("Vi-kzyvemRl4", "e740ed8a24/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg", "The apricot teddy bear puppy from our showroom, close up", 0.46, 0.444),
  photo("g_e4ebbc7fyG", "8276289ae7/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg", "The apricot teddy bear puppy from our showroom, looking up", 0.437, 0.402, "#080818"),
  photo("skvodl2NZiKq", "cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg", "The apricot teddy bear puppy from our showroom, held up to say hello", 0.453, 0.444),
];

export const showroomClip = {
  src: "/media/dSAUmXs8Qai9/ef39cbea20/27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4",
  poster: showroomPhotos[0].url,
  label: "Video of a tiny apricot teddy bear puppy in the TeddyPups showroom",
};
