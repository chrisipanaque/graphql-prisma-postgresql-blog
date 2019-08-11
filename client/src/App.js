import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';

import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '20px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

function App() {
  const [openDialog, setOpenDialog] = useState(false);

  const [expandedId, setExpandedId] = useState('');

  function handleExpandClick(id) {
    if (id === expandedId) {
      setExpandedId('');
    } else {
      setExpandedId(id);
    }
  }

  const {loading, error, data} = useQuery(GET_POSTS);

  const [createPost] = useMutation(CREATE_POST, {
    update(
      cache,
      {
        data: {createPost},
      },
    ) {
      const {posts} = cache.readQuery({query: GET_POSTS});
      cache.writeQuery({
        query: GET_POSTS,
        data: {posts: [createPost, ...posts]},
      });
    },
  });

  const [inputs, setInputs] = useState({
    title: '',
    content: '',
  });

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.id]: event.target.value,
    }));
  };

  const handleAddPost = (event) => {
    event.preventDefault();
    createPost({variables: {title: inputs.title, content: inputs.content}});
    handleCloseDialog();
    setInputs(() => ({
      title: '',
      content: '',
    }));
  };

  const classes = useStyles();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
              GraphQL Blog
            </Typography>
            <Button color='inherit' onClick={handleClickOpenDialog}>
              Create Post
            </Button>
          </Toolbar>
        </AppBar>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleAddPost}>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={inputs.title && inputs.content ? false : true}
            >
              ADD POST
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <div style={{marginTop: '15px'}}>
        {data.posts.map(({id, title, content}) => (
          <Card key={id} style={{margin: '15px 0 15px 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <CardContent>
                <Typography variant='h5' component='h2'>
                  {title}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => handleExpandClick(id)}
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: id === expandedId,
                  })}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
            </div>
            <Collapse
              in={id === expandedId ? true : false}
              timeout='auto'
              unmountOnExit
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {content}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
