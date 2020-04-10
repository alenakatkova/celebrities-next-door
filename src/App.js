// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';
//
//
// function App() {
// //   спаркл запрос
// //   SELECT ?a ?birthplace ?lat ?long ?typ WHERE {
// //       ?a ?q foaf:Person.
// //           ?a dbo:birthPlace ?birthplace.
// //       ?birthplace geo:lat ?lat.
// //       ?birthplace geo:long ?long.
// //       ?birthplace rdf:type ?typ.
// //       {?typ rdfs:label "village"@en}
// //   UNION
// //   {?typ rdfs:label "town"@en}
// //   UNION
// //   {?typ rdfs:label "city"@en}
// //
// //   FILTER (?lat > 63 && ?lat < 69 && ?long > 10 && ?long < 17.3)
// // }
// //   LIMIT 10
//
//   const [data, setData] = useState({ hits: [] });
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios(
//           `http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fa+%3Fbirthplace+%3Flat+%3Flong+%3Ftyp+WHERE+%7B%0D%0A%3Fa+%3Fq+foaf%3APerson.%0D%0A%3Fa+dbo%3AbirthPlace+%3Fbirthplace.%0D%0A%3Fbirthplace+geo%3Alat+%3Flat.%0D%0A%3Fbirthplace+geo%3Along+%3Flong.%0D%0A%3Fbirthplace+rdf%3Atype+%3Ftyp.%0D%0A%7B%3Ftyp+rdfs%3Alabel+%22village%22%40en%7D%0D%0AUNION%0D%0A%7B%3Ftyp+rdfs%3Alabel+%22town%22%40en%7D%0D%0AUNION%0D%0A%7B%3Ftyp+rdfs%3Alabel+%22city%22%40en%7D%0D%0A%0D%0AFILTER+%28%3Flat+%3E+63+%26%26+%3Flat+%3C+69+%26%26+%3Flong+%3E+10+%26%26+%3Flong+%3C+17.3%29%0D%0A%7D%0D%0ALIMIT+10&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`,
//       );
//       setData(result.data);
//     };
//
//     fetchData();
//   }, []);
//
//   return (
//     <div className="App">
//       <ul>
//         bla
//         {console.log(data)}
//         {
//           data.results === undefined
//             ? "net"
//             :
//             (data.results.bindings.map(item => (
//             <li key={0}>
//               {item.birthplace.value}
//             </li>
//         )))}
//       </ul>
//     </div>
//   );
// }
//
// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [data, setData] = useState({ bindings: [] });
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
          // 'https://hn.algolia.com/api/v1/search?query=redux',
          // `http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fa+%3Fbirthplace+%3Flat+%3Flong+%3Ftyp+WHERE+%7B%0D%0A%3Fa+%3Fq+foaf%3APerson.%0D%0A%3Fa+dbo%3AbirthPlace+%3Fbirthplace.%0D%0A%3Fbirthplace+geo%3Alat+%3Flat.%0D%0A%3Fbirthplace+geo%3Along+%3Flong.%0D%0A%3Fbirthplace+rdf%3Atype+%3Ftyp.%0D%0A%7B%3Ftyp+rdfs%3Alabel+%22village%22%40en%7D%0D%0AUNION%0D%0A%7B%3Ftyp+rdfs%3Alabel+%22town%22%40en%7D%0D%0AUNION%0D%0A%7B%3Ftyp+rdfs%3Alabel+%22city%22%40en%7D%0D%0A%0D%0AFILTER+%28%3Flat+%3E+63+%26%26+%3Flat+%3C+69+%26%26+%3Flong+%3E+10+%26%26+%3Flong+%3C+17.3%29%0D%0A%7D%0D%0ALIMIT+10&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`,
          `http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+%3Fid+%3Fname+%3Fimage+%3Flat+%3Flong+WHERE+%7B%0D%0A%3Flink+%3Fq+foaf%3APerson.%0D%0A%0D%0A%3Flink+dbo%3AbirthName+%3Fname.%0D%0A%3Flink+dbo%3AwikiPageID+%3Fid.%0D%0A%3Flink+dbo%3Aoccupation+%3Foccupation.%0D%0A%3Flink+foaf%3Adepiction+%3Fimage.%0D%0A%0D%0A%3Flink+dbo%3AbirthPlace+%3Flink2.%0D%0A%3Flink2+rdfs%3Alabel+%3Fbirthplace.%0D%0A%0D%0A%3Flink2+geo%3Alat+%3Flat.%0D%0A%3Flink2+geo%3Along+%3Flong.%0D%0A%0D%0AFILTER+%28+lang%28%3Fbirthplace%29+%3D+%22en%22+%29%0D%0A%7D%0D%0ALIMIT+5&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`,
      );
      setData(result.data.results);
    };
    fetchData();
  }, []);
  return (
      <ul>
        {console.log(data)}
        {

          data.bindings.map(item => (
            <li key={item.id.value}>
              <p>{item.name.value}</p>
              <img width="300px;" src={item.image.value} />
            </li>
        ))}
      </ul>
  );
}
export default App;
