/* eslint-disable @typescript-eslint/no-namespace */
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: boolean | string;
        'disable-zoom'?: boolean | string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        'interaction-prompt'?: string;
        'camera-orbit'?: string;
        'field-of-view'?: string;
      },
      HTMLElement
    >;
  }
}
