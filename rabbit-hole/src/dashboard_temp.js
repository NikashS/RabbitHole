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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
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



class Dashboard extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      cards: [],
      titles: "",
    }
  }

  getTitles() {
    var titles = "";
    

    await fetch(url)
        .then(function(response){return response.json();})
        .then(function(response) {
            var randoms = response.query.random;
            for (var r in randoms) {
              if (r != 0) {
                titles = titles.concat("|");
              }
              titles = titles.concat(randoms[r].title);              
            }
            console.log(titles);
            return titles;
        })
        .catch(function(error){console.log(error);});
  }

  componentDidMount() {

    var titles = this.getTitles();
    console.log(titles);
    var cards = []
    
    var url = "https://en.wikipedia.org/w/api.php";
    var params = {
      action: "query",
      format: "json",
      titles: titles,
      prop: "extracts",
      exchars: "175",
      explaintext: "true",
      exlimit: "10",
      exintro: "true",
    }

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url)
      .then(function(response){return response.json();})
      .then(function(response) {
        var descriptions = response.query.pages;
        for (const [key, value] of Object.entries(descriptions)) {
          var title = value.title;
          var extract = value.extract;
          var url = title.split(' ').join('_')

          cards.push([title, url, extract]);
          console.log(cards)
        }
      })
      .then(data => this.setState({cards: cards,}))
      .catch(function(error){console.log(error);});

  }

  render() {
    const { classes } = this.props;
    console.log(this.state.cards)
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
                  <Card className={classes.card}>
                    {/* <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title="Image title"
                    /> */}
                    <div>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card[0]}
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" onClick={ () => window.open( card[1] )}>
                        Wiki
                      </Button>
                      <Button size="small" color="primary">
                        Edit
                      </Button>
                    </CardActions>
                    </div>
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