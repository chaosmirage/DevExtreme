/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import type { InfernoNode } from 'inferno';

const CLASSES = {
  cover: 'dx-card-cover',
  image: 'dx-card-cover-image',
};

export interface CoverProps {
  imageSrc?: string;
  alt?: string;
  template?: (src: string, alt: string | undefined, className: string) => JSX.Element;
}

export class Cover extends PureComponent<CoverProps> {
  render(): InfernoNode {
    const {
      imageSrc, alt, template,
    } = this.props;
    const src = imageSrc;

    if (!src) {
      return null;
    }

    if (template) {
      return template(src, alt, CLASSES.image);
    }
    return (
      <div className={CLASSES.cover}>
        <img
          src={src}
          alt={alt}
          className={CLASSES.image}
        />
      </div>
    );
  }
}
