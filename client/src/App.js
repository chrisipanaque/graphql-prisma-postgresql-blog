import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

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
    <Container maxWidth='sm'>
      <div>
        {data.posts.map(({id, title, content}) => (
          <Card key={id}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  {title}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {content}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions style={{justifyContent: 'flex-end'}}>
              <Button size='small' color='primary'>
                Read More
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default App;
