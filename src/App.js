import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [data, setData] = useState({ bindings: [] });
  useEffect(() => {
      const query  = `
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
          FILTER ( ?lat > ${63} && ?lat < ${65} && ?long > ${10} && ?long < ${100} )
          }
          LIMIT 10
      `;

    let instance = axios.create({
      method: 'get',
      url: 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='
    });

    instance.request({
      params: {
        query: query
      },
    })
        .then(function (response) {
          if (response && response.data) {
            console.log(response.data);
            setData(response.data.results);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
  }, []);

  return (
      <ul>
        {data.bindings.map(item => (
            <li key={item.id.value}>
              <p>{item.name.value}</p>
              <img alt={item.name.value} width="300px;" src={item.image.value} />
            </li>
        ))}
      </ul>
  );
}
export default App;
