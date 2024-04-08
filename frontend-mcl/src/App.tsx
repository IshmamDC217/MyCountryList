import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import './App.css';

interface CountryVisit {
  ID: number;
  CountryName: string;
  VisitDate: number;
  Notes: string;
  Rating: number;
}

function App() {
  const [countryVisits, setCountryVisits] = useState<CountryVisit[]>([]);
  const [newVisit, setNewVisit] = useState({ CountryName: '', VisitDate: 0, Notes: '', Rating: 0 });

  useEffect(() => {
    fetch('http://localhost:5004/api/countries')
      .then(response => response.json())
      .then(data => setCountryVisits(data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const data = React.useMemo(() => countryVisits, [countryVisits]);

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'ID' },
      { Header: 'Country Name', accessor: 'CountryName' },
      { Header: 'Visit Date', accessor: 'VisitDate' },
      { Header: 'Notes', accessor: 'Notes' },
      { Header: 'Rating', accessor: 'Rating' },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }: { row: any }) => (
          <button onClick={() => deleteCountryVisit(row.original.ID)}>Delete</button>
        ),
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  const addCountryVisit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('http://localhost:5004/api/countries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVisit),
    })
      .then(response => response.json())
      .then(data => {
        setCountryVisits(currentVisits => [...currentVisits, data]);
        setCountryVisits(currentVisits => currentVisits);

        setNewVisit({ CountryName: '', VisitDate: 0, Notes: '', Rating: 0 });
      })
      .catch(error => console.error('Error adding country visit:', error));
  };

  const deleteCountryVisit = (id: number) => {
    const updatedVisits = countryVisits.filter(visit => visit.ID !== id);
    setCountryVisits(updatedVisits);
  
    fetch(`http://localhost:5004/api/countries/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Deletion failed');
      }
    })
    .catch(error => {
      console.error('Error deleting country visit:', error);
      setCountryVisits(countryVisits);
    });
  };

  return (
    <div className="App container">
      <h1 className='title'>Countries I Have Visited</h1>
      <form onSubmit={addCountryVisit}>
        <p className='input-field'>Country Name:</p>
        <input
          className='field'
          type="text"
          placeholder="Greece"
          value={newVisit.CountryName}
          onChange={e => setNewVisit({ ...newVisit, CountryName: e.target.value })}
        />
        <p className='input-field'>Visit Date:</p>
        <input
          className='field'
          type="number"
          placeholder="Visit Date"
          value={newVisit.VisitDate}
          onChange={e => setNewVisit({ ...newVisit, VisitDate: Number(e.target.value) })}
        />
        <p className='input-field'>Notes:</p>
        <input
          className='field'
          type="text"
          placeholder="Notes"
          value={newVisit.Notes}
          onChange={e => setNewVisit({ ...newVisit, Notes: e.target.value })}
        />
        <p className='input-field'>Rating:</p>
        <input
          className='field'
          type="number"
          placeholder="Rating"
          value={newVisit.Rating}
          onChange={e => setNewVisit({ ...newVisit, Rating: Number(e.target.value) })}
        />
        <p></p>
        <button type="submit">Add Country</button>
      </form>
      <table className='table' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
