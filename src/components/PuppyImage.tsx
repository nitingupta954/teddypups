import Image, { type ImageProps } from "next/image";
import type { Media } from "@/lib/puppies";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height" | "placeholder" | "blurDataURL"> & {
  media: Media;
  alt?: string;
};

/** next/image for CMS media: honours the focal point, dominant colour and blur placeholder. */
export function PuppyImage({ media, alt, fill, style, ...rest }: Props) {
  const img = media.kind === "video" && media.poster ? media.poster : media;
  return (
    <Image
      src={img.url}
      alt={alt ?? img.alt}
      {...(fill ? { fill: true } : { width: img.width, height: img.height })}
      placeholder={img.blurDataUrl ? "blur" : "empty"}
      blurDataURL={img.blurDataUrl ?? undefined}
      style={{
        objectFit: "cover",
        objectPosition: `${(img.focalX * 100).toFixed(1)}% ${(img.focalY * 100).toFixed(1)}%`,
        backgroundColor: img.color,
        ...style,
      }}
      {...rest}
    />
  );
}
