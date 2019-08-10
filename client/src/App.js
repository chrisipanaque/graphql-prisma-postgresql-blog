import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';

function App() {
  const {loading, error, data} = useQuery(gql`
    query {
      posts {
        id
        title
        content
      }
    }
  `);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <div>
        {data.posts.map(({id, title, content}) => (
          <div key={id}>
            <h1>{title}</h1>
            <p>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
