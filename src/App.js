import { useState } from "react";
import * as ipfsClient from "ipfs-http-client";
import { CID } from "ipfs-http-client";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  input: {
    display: "none",
  },
  box: {
    height: "4px",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(1),
    width: theme.spacing(90),
    height: theme.spacing(80),
  },
}));

function App() {
  const classes = useStyles();
  const [memeHash, setMemeHash] = useState(
    "bafybeigc5k5hriuejo5ccdre7cnmcppml2vmx4ffjfw7juiai6nusdye7u"
  );
  const [progress, setProgress] = useState(0);
  const [sizeFile, setSizeFile] = useState(0);

  const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
  });

  const normalise = (value) => (value * 100) / sizeFile;

  const toBase32 = (value) => {
    const cid = new CID(value);
    return cid.toV1().toBaseEncodedString("base32");
  };

  const changeHandler = async (event) => {
    event.preventDefault();
    const memeFile = event.target.files[0];
    setSizeFile(memeFile.size);
    const res = await ipfs.add(memeFile, {
      progress: (prog) => setProgress(prog),
    });
    setProgress(0);
    const resV1 = res.cid.toV1();
    setMemeHash(toBase32(resV1));
  };

  return (
    <div>
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title}>
              Meme of the day!!!
            </Typography>
            <Input
              onChange={changeHandler}
              inputProps={{ accept: "image/*" }}
              type="file"
              id="add_meme"
              className={classes.input}
            />
            <InputLabel htmlFor="add_meme">
              <Button variant="contained" color="secondary" component="span">
                ADD MEME
              </Button>
            </InputLabel>
          </Toolbar>
        </AppBar>
        {!!progress ? (
          <LinearProgress
            color="secondary"
            variant="determinate"
            value={normalise(progress)}
          />
        ) : (
          <Box className={classes.box}></Box>
        )}
        <Typography variant="h3" align="center">
          Meme on the topic of the day
        </Typography>
        <Grid justify="center" container>
          <Paper className={classes.paper} elevation={3}>
            <img src={`https://${memeHash}.ipfs.infura-ipfs.io/`} />
          </Paper>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
