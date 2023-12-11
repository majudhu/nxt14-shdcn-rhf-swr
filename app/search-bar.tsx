export default function SearchBar({
  en,
  onSearch,
}: {
  en?: boolean;
  onSearch: (e: string) => void;
}) {
  return (
    <form
      className='relative text-pumpkin'
      onSubmit={(e) => {
        e.preventDefault(); // @ts-expect-error elements is not typed
        onSearch(e.currentTarget.elements.search.value);
      }}
    >
      <input
        type='text'
        name='search'
        className='w-full px-5 py-4 rounded-20'
        placeholder={en ? 'Search' : 'ހޯއްދަވާ'}
      />
      <button
        type='submit'
        className={`absolute inset-y-4 ${en ? ' right-4' : ' left-4'}`}
      >
        <img src='/icons/search-big.svg' alt='Search' width='23' height='23' />
      </button>
    </form>
  );
}
