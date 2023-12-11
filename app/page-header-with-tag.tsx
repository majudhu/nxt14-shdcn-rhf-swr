interface Props {
  tag: string;
  title: string;
}

export default function PageHeaderWithTag({ tag, title }: Props) {
  return (
    <header className='container pt-14 pb-10 text-center'>
      <span className='tag-primary'>{tag}</span>
      <h2 className='hd1 py-6'>{title}</h2>
    </header>
  );
}
