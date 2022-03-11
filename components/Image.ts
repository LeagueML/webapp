import { NextPageContext } from 'next';
import Image from 'next/image';

// opt-out of image optimization, no-op
const customLoader = ({ src } : { src : any}) => {
  return src
}

export default function ImageP(props : NextPageContext) {
  return (
    <Image
      {...props}
      loader={customLoader}
    />
  );
}