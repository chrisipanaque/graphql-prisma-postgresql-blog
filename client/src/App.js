import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
    }
  }
`;

const ADD_POST = gql`
  mutation AddPost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

function App() {
  const {loading, error, data} = useQuery(GET_POSTS);

  const [addPost] = useMutation(ADD_POST);

  const [inputs, setInputs] = useState({
    title: '',
    content: '',
  });

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.id]: event.target.value,
    }));
  };

  const handleAddPost = (event) => {
    event.preventDefault();
    addPost({variables: {title: inputs.title, content: inputs.content}});
    setInputs(() => ({
      title: '',
      content: '',
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <Container maxWidth='sm'>
      <form onSubmit={handleAddPost}>
        <TextField
          id='title'
          label='Title'
          variant='outlined'
          multiline
          rowsMax='4'
          fullWidth
          value={inputs.title}
          onChange={handleInputChange}
        />
        <TextField
          id='content'
          label='Content'
          multiline
          margin='normal'
          variant='outlined'
          rows='8'
          fullWidth
          value={inputs.content}
          onChange={handleInputChange}
        />
        <Button type='submit' variant='contained' color='primary' fullWidth>
          ADD POST
        </Button>
      </form>

      <div style={{marginTop: '15px'}}>
        {data.posts.map(({id, title, content}) => (
          <Card key={id} style={{margin: '15px 0 15px 0'}}>
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
