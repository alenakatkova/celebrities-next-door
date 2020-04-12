import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Request(props) {
  const [data, setData] = useState({ bindings: [] });
  const [lat, setLat] = useState(props.lat);
  const [long, setLong] = useState(props.long);
  const [query, setQuery] = useState(undefined); // UNDEFINED??

  useEffect(() => {
    setLat(props.lat);
  }, [props.lat]);

  useEffect(() => {
    setLong(props.long);
  }, [props.long]);


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
          type="number"
          value={lat}
          onChange={event => setLat(parseFloat(event.target.value))}
      />
        LONG: <input
          type="number"
          value={long}
          onChange={event => setLong(parseFloat(event.target.value))}
      />
        <button
            type="button"
            onClick={() => {
              console.log(lat, long);
              setQuery(`FILTER ( ?lat > ${lat - 0.5} && ?lat < ${lat + 0.5} && ?long > ${long - 0.5} && ?long < ${long + 0.5} )`);
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
export default Request;
