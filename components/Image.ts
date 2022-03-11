import { NextPageContext } from 'next';
import Image from 'next/image';

// opt-out of image optimization, no-op
const customLoader = ({ src } : { src : any}) => {
  return src
}

const normalizeSrc = src => {
  return src.startsWith('/') ? src.slice(1) : src;
};

const cloudflareLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};


export default function ImageP(props : NextPageContext) {
  return (
    <Image
      {...props}
      loader={customLoader}
    />
  );
}