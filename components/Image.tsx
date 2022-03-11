import { NextPageContext } from 'next';
import { ImageProps } from 'next/image';
import Image from 'next/image';

const customLoader = ({ src } : { src : any}) => {
  return src // opt-out of image optimization, no-op
}

const normalizeSrc = (src : string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};

const cloudflareLoader = ({ src, width, quality } : { src : string, width : number, quality : number}) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};


export default function ImageP(props : ImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image {...props} loader={customLoader}/>
  );
}