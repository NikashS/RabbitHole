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
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardActionArea from '@material-ui/core/CardActionArea';


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

const apiRequestTitle = () => {
  var url = "https://en.wikipedia.org/w/api.php"; 
  var params = {
    action: "query",
    format: "json",
    list: "random",
    rnlimit: "12",
    rnnamespace: "0",
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
  
  return apiRequest(url).then(response => {
    var titles = ""
    var randoms = response.query.random;
    for (var r in randoms) {
      if (r != 0) {
        titles = titles.concat("|");
      }
      titles = titles.concat(randoms[r].title);
    }
    return {
      titles: titles,
    };
  });
};

const apiRequestExtracts = (titles) => {
  console.log(titles)
  var url = "https://en.wikipedia.org/w/api.php";
  var params = {
    action: "query",
    format: "json",
    titles: titles,
    prop: "extracts",
    exchars: "175",
    explaintext: "true",
    exlimit: "12",
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
      cards.push([title, url, extract]);
      index = index + 1;
    }
    return {
      cards: cards,
    };
  });
}



class Dashboard extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      loading: false,
      cards: [],
      titles: "",
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    Promise.all([apiRequestTitle()])
      .then(results => {
        this.setState({titles: results[0].titles}, () => console.log(this.state.titles));
        Promise.all([apiRequestExtracts(this.state.titles)])
        .then(results => {
          this.setState({cards: results[0].cards, loading: false,}, () => console.log(this.state.cards));
        });
      });
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
              variant="contained"
              color="default"
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
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<TrendingUpIcon />}
            >
              Trending
            </Button>
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
              variant="contained"
              color="default"
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
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<TrendingUpIcon />}
            >
              Trending
            </Button>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container spacing={3}>
              {this.state.cards.map((card) => (
                <Grid item key={card} xs={3}>
                  <Card className={classes.card} onClick={ () => window.open( card[1] )}>
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
                      <Button size="small" color="primary" onClick={ () => window.open( card[1] )}>
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