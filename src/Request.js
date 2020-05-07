import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function Request(props) {
  const [data, setData] = useState({ bindings: [] });
  const [lat, setLat] = useState(props.lat);
  const [long, setLong] = useState(props.long);

  const handleChange = () => {
    props.onLatChange(lat);
  };

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
          FILTER ( ?lat > ${props.lat - 0.5} && ?lat < ${props.lat + 0.5} && ?long > ${props.long - 0.5} && ?long < ${props.long + 0.5} )
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
        // .then(function(r) {
        //   console.log(data);
        //   handleChange();
        //})
        .catch(function (error) {
          console.log(error);
        });
  }, [props.lat, props.long]);

  return (
      <Fragment>
        LAT: <input
          type="number"
          value={lat}
          onChange={(event) => {setLat(parseFloat(event.target.value))}}
      />
        LONG: <input
          type="number"
          value={long}
          onChange={event => setLong(parseFloat(event.target.value))}
      />


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
