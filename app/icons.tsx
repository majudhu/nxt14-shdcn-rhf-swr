export const UndoIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M9.25 4.75L4.75 9L9.25 13.25'
    ></path>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M5.5 9H15.25C17.4591 9 19.25 10.7909 19.25 13V19.25'
    ></path>
  </svg>
);

export const RedoIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M14.75 4.75L19.25 9L14.75 13.25'
    ></path>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M19.25 9H8.75C6.54086 9 4.75 10.7909 4.75 13V19.25'
    ></path>
  </svg>
);

export const BoldIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M6.75 4.75H12.5C14.5711 4.75 16.25 6.42893 16.25 8.5C16.25 10.5711 14.5711 12.25 12.5 12.25H6.75V4.75Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M6.75 12.25H13.75C15.683 12.25 17.25 13.817 17.25 15.75C17.25 17.683 15.683 19.25 13.75 19.25H6.75V12.25Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);

export const ItalicIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M14 4.75H11.75M14 4.75H16.25M14 4.75L10 19.25M10 19.25H7.75M10 19.25H12.25'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);

export const UnderlineIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M4.75 19.25H19.25'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M16.25 4.75V11C16.25 13.3472 14.3472 15.25 12 15.25C9.65279 15.25 7.75 13.3472 7.75 11V4.75'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);

export const HeadingIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M5.75 5.75H7.25M7.25 5.75H8.25M7.25 5.75V11.75M7.25 18.25H5.75M7.25 18.25H8.25M7.25 18.25V11.75M7.25 11.75H16.75M16.75 11.75V5.75M16.75 11.75V18.25M18.25 5.75H16.75M16.75 5.75H15.75M16.75 18.25H18.25M16.75 18.25H15.75'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);

export const QuoteIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H9.25C10.3546 4.75 11.25 5.64543 11.25 6.75V8.93651C11.25 9.7738 10.9001 10.573 10.2848 11.1409L8 13.25V10.25H6.75C5.64543 10.25 4.75 9.35457 4.75 8.25V6.75Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M12.75 12.75C12.75 11.6454 13.6454 10.75 14.75 10.75H17.25C18.3546 10.75 19.25 11.6454 19.25 12.75V14.9365C19.25 15.7738 18.9001 16.573 18.2848 17.1409L16 19.25V16.25H14.75C13.6454 16.25 12.75 15.3546 12.75 14.25V12.75Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);

export const OrderedListIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24 '
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M4.75 6.25L6.25 4.75V10.25M6.25 10.25H4.75M6.25 10.25H7.25'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M13.25 14.25H11.6562C10.9255 14.25 10.5182 13.4359 10.9058 12.8574C10.9535 12.7861 11.0211 12.7311 11.0925 12.6836L12.8924 11.486C12.9638 11.4384 13.0312 11.3832 13.0799 11.3126C13.5253 10.6678 13.0713 9.75 12.2526 9.75H10.75'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M16.75 14.75H18.1964C19.4308 14.75 19.6499 16.6376 18.5101 16.9556C18.4549 16.971 18.397 16.9772 18.3398 16.9792L17.75 17L18.3398 17.0208C18.397 17.0228 18.4549 17.0289 18.5101 17.0444C19.6499 17.3624 19.4308 19.25 18.1964 19.25H16.75'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);

export const UnOrderedListIcon = ({
  className,
  ...props
}: React.HTMLProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    strokeWidth='0'
    fill='none'
    viewBox='0 0 24 24'
    className={className}
    height='1em'
    width='1em'
    {...props}
  >
    <path
      d='M6.5 6C6.5 6.27614 6.27614 6.5 6 6.5C5.72386 6.5 5.5 6.27614 5.5 6C5.5 5.72386 5.72386 5.5 6 5.5C6.27614 5.5 6.5 5.72386 6.5 6Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M6.5 12C6.5 12.2761 6.27614 12.5 6 12.5C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5C6.27614 11.5 6.5 11.7239 6.5 12Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M6.5 18C6.5 18.2761 6.27614 18.5 6 18.5C5.72386 18.5 5.5 18.2761 5.5 18C5.5 17.7239 5.72386 17.5 6 17.5C6.27614 17.5 6.5 17.7239 6.5 18Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M9.75 6H18.25'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M9.75 12H18.25'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
    <path
      d='M9.75 18H18.25'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
);
