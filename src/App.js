import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [data, setData] = useState({ bindings: [] });
  const [lat, setLat] = useState(undefined); // UNDEFINED??
  const [long, setLong] = useState(undefined); // UNDEFINED??
  const [query, setQuery] = useState(undefined); // UNDEFINED??

  useEffect(() => {
      const q  = `
          SELECT DISTINCT ?person ?id ?name ?image ?lat ?long WHERE {
          ?person ?q foaf:Person.
          
          ?person dbo:birthName ?name.
          ?person dbo:wikiPageID ?id.
          ?person foaf:depiction ?image.
          
          ?person dbo:birthPlace ?address.
          ?address rdfs:label ?birthplace.
          
          ?address geo:lat ?lat.
          ?address geo:long ?long.
          
          FILTER ( lang(?birthplace) = "en" )
          ${query}
          }
          LIMIT 10
      `;


    let instance = axios.create({
      method: 'get',
      url: 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='
    });

    instance.request({
      params: {
        query: q
      },
    })
        .then(function (response) {
          if (response && response.data) {
            console.log(response.data);
            setData({ bindings: [] });
            setData(response.data.results);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
  }, [query]);

  return (
      <Fragment>
        LAT: <input
            type="text"
            value={lat}
            onChange={event => setLat(event.target.value)}
        />
        LONG: <input
            type="text"
            value={long}
            onChange={event => setLong(event.target.value)}
        />
        <button
            type="button"
            onClick={() => {
              setQuery(`FILTER ( ?lat > ${lat - 2} && ?lat < ${lat + 2} && ?long > ${long - 2} && ?long < ${long + 2} )`);
            }}
        >
          Search
        </button>
        {data.bindings.length === 0
            ? "no data"
            : (<ul>
              {data.bindings.map(item => (
                  <li key={item.id.value}>
                    <p>{item.name.value}</p>
                    <img alt={item.name.value} width="300px;" src={item.image.value} />
                  </li>
              ))}
            </ul>)
        }


      </Fragment>

  );
}
export default App;
