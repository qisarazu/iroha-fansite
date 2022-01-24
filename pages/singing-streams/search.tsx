import { SingingStreamMediaObject } from '../../components/SingingStreamMediaObject/SingingStreamMediaObject';
import { useSingingStreamsForSearch } from '../../hooks/singing-stream';
import styles from './search.module.scss';

function SingingStreamsSearchPage() {
  const { streams } = useSingingStreamsForSearch();

  if (!streams) return <div>Loading...</div>;
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Search</h1>
      <main className={styles.main}>
        <ul className={styles.list}>
          {streams.map((stream) => (
            <li className={styles.listItem} key={stream.id}>
              <SingingStreamMediaObject singingStream={stream} />
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}

export default SingingStreamsSearchPage;
