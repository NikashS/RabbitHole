import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SearchIcon from '@material-ui/icons/Search';
import { fade, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardActionArea from '@material-ui/core/CardActionArea';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = theme => ({
  appbar: {
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loading: {
    position: 'relative', 
  },
  loadingIcon: {
    marginTop: '20%',
    marginLeft: '48%',
  },
  card: {
    height: '100%',
  },
  cardContent: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
});

const apiRequest = url => fetch(url).then(response => response.json())

const apiRequestRandomTitle = () => {
  var url = "https://en.wikipedia.org/w/api.php"; 
  var params = {
    action: "query",
    format: "json",
    list: "random",
    rnlimit: "8",
    rnnamespace: "0",
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
  
  return apiRequest(url).then(response => {
    var titles = ""
    var randoms = response.query.random;
    for (var r in randoms) {
      if (r !== 0) {
        titles = titles.concat("|");
      }
      titles = titles.concat(randoms[r].title);
    }
    return {
      titles: titles,
    };
  });
};

const apiRequestTitle = (title) => {
  var url = "https://en.wikipedia.org/w/api.php"; 
  var params = {
    action: "query",
    format: "json",
    prop: "links",
    titles: title,
    plnamespace: "0",
    pllimit: "500",
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
  
  return apiRequest(url).then(response => {
    console.log(response)
    var titles = "";
    var result = response.query.pages;
    titles = titles.concat(title);

    for (const [key, value] of Object.entries(result)) {
      for (var i = 0; i < 7; i++) {
        var index = Math.floor(Math.random() * value.links.length); 
        titles = titles.concat("|");
        titles = titles.concat(value.links[index].title);
      }
    }

    return {
      titles: titles,
    };
  });
};

const apiRequestExtracts = (titles) => {
  var url = "https://en.wikipedia.org/w/api.php";
  var params = {
    action: "query",
    format: "json",
    titles: titles,
    prop: "extracts",
    exchars: "175",
    explaintext: "true",
    exlimit: "8",
    exintro: "true",

  }

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

  return apiRequest(url).then(response => {
    var cards = [];
    var descriptions = response.query.pages;
    var index = 0;
    for (const [key, value] of Object.entries(descriptions)) {
      var title = value.title;
      var url = "https://en.wikipedia.org/wiki/".concat(title.split(' ').join('_'));
      if (title.length > 18) {
        title = title.substring(0, 20).concat("...")
      }
      var extract = value.extract;
      if (extract.length === 3) {
        extract = "[No description found on Wikipedia]";
      }
      if (title.toLowerCase() === titles.substring(0, titles.indexOf('|'))) {
        cards.unshift([title, url, extract])
      }
      else {
        cards.push([title, url, extract]);
      }
      index = index + 1;
    }
    return {
      cards: cards,
    };
  });
}

export function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const bookmarkCode = "javascript:(function(){var wiki=window.location.href.split('/').slice(-1)[0];var url=\"http://localhost:3000/\".concat(wiki);window.open(url);})();"

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button color="default" variant="contained" startIcon={<BookmarkBorderIcon />} onClick={handleClickOpen}>
        Bookmark
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Bookmark me to access directly from Wikipedia!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Right click on your bookmarks bar and click "Add Page...". Give your bookmark a name, and copy the following code into the URL field. Then, you're set!
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
           {bookmarkCode}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}



class Dashboard extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      loading: false,
      cards: [],
      titles: "",
      base: "",
    }
    this.keyPress = this.keyPress.bind(this);
    this.handleRandom = this.handleRandom.bind(this);
    this.handleSpecific = this.handleSpecific.bind(this);
  }

  async handleRandom() {
    console.log("here")
    this.setState({loading: true})
    if (this.state.base === "") {
      Promise.all([apiRequestRandomTitle()])
      .then(results => {
        this.setState({titles: results[0].titles}, () => console.log(this.state.titles));
        Promise.all([apiRequestExtracts(this.state.titles)])
        .then(results => {
          this.setState({cards: results[0].cards, loading: false,}, () => console.log(this.state.cards));
        });
      });
    }
  }

  async handleSpecific(base) {
    await this.setState({base: base}, () => console.log(this.state.base));
      this.setState({loading: true}, () => console.log(this.state.loading));
      Promise.all([apiRequestTitle(this.state.base)])
      .then(results => {
        this.setState({titles: results[0].titles}, () => console.log(this.state.titles));
        Promise.all([apiRequestExtracts(this.state.titles)])
        .then(results => {
          this.setState({cards: results[0].cards, loading: false,}, () => console.log(this.state.cards));
        });
      });
  }

  async handleClick(title, url) {
    window.open( url );
    this.handleSpecific(title);
  }

  componentDidMount() {
    var openedWith = window.location.href.split('/').slice(-1)[0];
    if (openedWith === "") {
      this.handleRandom();
    }
    else {
      this.handleSpecific(openedWith);
    }
    
  }

  async keyPress(e){
    if(e.keyCode === 13){
      this.handleSpecific(e.target.value);
    }
 }

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return (
        <React.Fragment>
        <CssBaseline />
        <AppBar className={classes.appbar} position="relative">
          <Toolbar>
            <Button
              onClick={this.handleRandom}
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<RefreshIcon />}
            >
              &nbsp;Random&nbsp;
            </Button>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>

              <InputBase
                placeholder="Search…"
                onKeyDown={this.keyPress}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <AlertDialog></AlertDialog>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.loading} maxWidth="lg">
            <div><CircularProgress className={classes.loadingIcon}  size={40}/></div>
            
          </Container>
        </main>
      </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar className={classes.appbar} position="relative">
          <Toolbar>
            <Button
              onClick={this.handleRandom}
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<RefreshIcon />}
            >
              &nbsp;Random&nbsp;
            </Button>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>

              <InputBase
                placeholder="Search…"
                onKeyDown={this.keyPress}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <AlertDialog></AlertDialog>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container spacing={3}>
              {this.state.cards.map((card) => (
                <Grid item key={card} xs={3}>
                  <Card className={classes.card} onClick={() => this.handleClick(card[0], card[1]) }>
                    <CardActionArea>
                      <div>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card[0]}
                        </Typography>
                        <Typography>
                          {card[2]}
                        </Typography>
                      </CardContent>
                      
                      <CardActions>
                      <Button size="small" color="primary" onClick={ () => this.handleClick(card[0], card[1])}>
                          Wiki
                        </Button>
                      </CardActions>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          
        </main>
        
        
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Dashboard);