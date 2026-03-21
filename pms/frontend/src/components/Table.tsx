interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[],
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

const Table = <T,>({ columns, data, keyExtractor, emptyMessage = "No data found"}: TableProps<T>) => {
  if (data.length === 0) {
    return <div className="subtitle">{emptyMessage}</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={keyExtractor(row)}>
            {columns.map((col, i) => (
              <td key={i}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
};

export default Table;
