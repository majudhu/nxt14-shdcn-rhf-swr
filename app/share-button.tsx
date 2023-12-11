import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import dynamic from 'next/dynamic';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from 'react-share';

export function ShareButtonCSR({
  className,
  en,
}: {
  className?: string;
  en?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger className={className}>
        {en ? 'Share' : 'ޝެއަރ ކުރެއްވުމަށް'}
      </PopoverTrigger>
      <PopoverContent className='flex justify-between'>
        <FacebookShareButton url={window.location.href}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href}>
          <XIcon size={32} round />
        </TwitterShareButton>
        <ViberShareButton url={window.location.href}>
          <ViberIcon size={32} round />
        </ViberShareButton>
        <WhatsappShareButton url={window.location.href}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <LinkedinShareButton url={window.location.href}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <TelegramShareButton url={window.location.href}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </PopoverContent>
    </Popover>
  );
}

export const ShareButton = dynamic(
  () => import('@/app/share-button').then((mod) => mod.ShareButtonCSR),
  { ssr: false }
);
