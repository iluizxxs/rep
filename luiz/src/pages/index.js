import Head from 'next/head';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';

const fetchCotations = (endpoint) => fetch(endpoint).then(res => res.json());

const CotationViewer = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: cotations, error, isLoading } = useSWR(
    'https://economia.awesomeapi.com.br/json/daily/USD-BRL/30',
    fetchCotations,
    { refreshInterval: 10000 }
  );

  const filteredCotations = useMemo(() => {
    if (!cotations || !fromDate || !toDate) return [];

    const start = new Date(fromDate);
    const end = new Date(toDate);

    return cotations.filter((entry) => {
      const current = new Date(Number(entry.timestamp) * 1000);
      return current >= start && current <= end;
    });
  }, [cotations, fromDate, toDate]);

  return (
    <div className={styles.container}>
      <Head>
        <title>USD para BRL</title>
        <meta name="description" content="Visualização de cotações com filtro por data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Cotação do Dólar para Real</h1>

        <div className={styles.description}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <label>
              De:
              <input
                type="date"
                className="date-picker"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </label>
            <label>
              Até:
              <input
                type="date"
                className="date-picker"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </label>
          </div>
        </div>

        {error && (
          <p className={styles.description}>Erro ao carregar os dados. Tente novamente.</p>
        )}
        {isLoading && (
          <p className={styles.description}>Obtendo dados...</p>
        )}

        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Data</div>
          <div className={styles.tableCell}>Compra</div>
          <div className={styles.tableCell}>Venda</div>
          <div className={styles.tableCell}>Alta</div>
          <div className={styles.tableCell}>Baixa</div>
          <div className={styles.tableCell}>Variação</div>
        </div>

        {filteredCotations.map((item, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={styles.tableCell}>
              {new Date(item.timestamp * 1000).toLocaleDateString()}
            </div>
            <div className={styles.tableCell}>R$ {item.bid}</div>
            <div className={styles.tableCell}>R$ {item.ask}</div>
            <div className={styles.tableCell}>R$ {item.high}</div>
            <div className={styles.tableCell}>R$ {item.low}</div>
            <div className={styles.tableCell}>
              {item.varBid} ({item.pctChange}%)
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default CotationViewer;
