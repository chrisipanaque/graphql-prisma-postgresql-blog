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

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
      title
      content
    }
  }
`;

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

export default function App() {
  const classes = useStyles();

  const [createInputs, setCreateInputs] = useState({
    title: '',
    content: '',
  });

  const [updateInputs, setUpdateInputs] = useState({
    id: '',
    title: '',
    content: '',
  });

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [expandedCardId, setExpandedCardId] = useState('');

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

  const [updatePost] = useMutation(UPDATE_POST);

  const [deletePost] = useMutation(DELETE_POST, {
    update(
      cache,
      {
        data: {deletePost},
      },
    ) {
      const {posts} = cache.readQuery({query: GET_POSTS});
      cache.writeQuery({
        query: GET_POSTS,
        data: {posts: posts.filter((post) => post.id !== deletePost.id)},
      });
    },
  });

  const handleExpandCard = (id) => {
    if (id === expandedCardId) {
      setExpandedCardId('');
    } else {
      setExpandedCardId(id);
    }
  };

  const handleClickOpenDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
    setCreateInputs(() => ({
      title: '',
      content: '',
    }));
  };

  const handleClickOpenUpdateDialog = (id, title, content) => {
    setUpdateInputs((updateInputs) => ({
      ...updateInputs,
      id,
      title,
      content,
    }));
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setUpdateInputs((updateInputs) => ({
      ...updateInputs,
      id: '',
      title: '',
      content: '',
    }));
  };

  const handleInputChange = (event) => {
    event.persist();
    setCreateInputs((createInputs) => ({
      ...createInputs,
      [event.target.id]: event.target.value,
    }));
  };

  const handleUpdateInputChange = (event) => {
    event.persist();
    setUpdateInputs((updateInputs) => ({
      ...updateInputs,
      [event.target.id]: event.target.value,
    }));
  };

  const handleCreatePost = (event) => {
    event.preventDefault();
    createPost({
      variables: {title: createInputs.title, content: createInputs.content},
    });
    handleCloseDialog();
  };

  const handleUpdatePost = (event) => {
    event.preventDefault();
    updatePost({
      variables: {
        id: updateInputs.id,
        title: updateInputs.title,
        content: updateInputs.content,
      },
    });
    handleCloseUpdateDialog();
  };

  const handleDeletePost = (id) => {
    deletePost({variables: {id}});
  };

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
            <Button
              variant='outlined'
              color='inherit'
              onClick={handleClickOpenDialog}
            >
              Create Post
            </Button>
          </Toolbar>
        </AppBar>
      </div>

      <Dialog open={openCreateDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleCreatePost}>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogContent>
            <TextField
              id='title'
              label='Title'
              variant='outlined'
              multiline
              rowsMax='4'
              fullWidth
              value={createInputs.title}
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
              value={createInputs.content}
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
              disabled={
                createInputs.title && createInputs.content ? false : true
              }
            >
              Add Post
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <form onSubmit={handleUpdatePost}>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <TextField
              id='title'
              label='Title'
              variant='outlined'
              multiline
              rowsMax='4'
              fullWidth
              value={updateInputs.title}
              onChange={handleUpdateInputChange}
            />
            <TextField
              id='content'
              label='Content'
              multiline
              margin='normal'
              variant='outlined'
              rows='8'
              fullWidth
              value={updateInputs.content}
              onChange={handleUpdateInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={
                updateInputs.title && updateInputs.content ? false : true
              }
            >
              Update Post
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <div style={{marginTop: '15px'}}>
        {data.posts.map(({id, title, content}) => (
          <Card key={id} style={{margin: '15px 0 15px 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <CardActionArea onClick={() => handleExpandCard(id)}>
                <CardContent>
                  <Typography variant='h5' component='h2'>
                    {title}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <IconButton
                  onClick={() => handleExpandCard(id)}
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: id === expandedCardId,
                  })}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
            </div>
            <Collapse
              in={id === expandedCardId ? true : false}
              timeout='auto'
              unmountOnExit
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {content}
                </Typography>
              </CardContent>
              <CardActions style={{justifyContent: 'flex-end'}}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() =>
                    handleClickOpenUpdateDialog(id, title, content)
                  }
                >
                  Edit Post
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => handleDeletePost(id)}
                >
                  Delete Post
                </Button>
              </CardActions>
            </Collapse>
          </Card>
        ))}
      </div>
    </div>
  );
}
