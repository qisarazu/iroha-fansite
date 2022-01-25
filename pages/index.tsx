import Link from 'next/link';

function IndexPage() {
  return (
    <div>
      <h1>iroha fan site.</h1>
      <Link href="/singing-streams/search">
        <a>歌枠検索</a>
      </Link>
    </div>
  );
}

export default IndexPage;
