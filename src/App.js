// This app is a camera database that utilizes the Flickr API's camera method.
// It allows the user to select or search a specific camera brand
// and get the data of all models of that brand.
import React from 'react';
import ReactMdl from 'react-mdl';

import './app.css';

// import react-mdl elements
import {
  Button, Card, CardText, Layout, Header, Navigation,
  Drawer, Footer, Textfield, Grid, Cell,
  CardTitle, CardActions, Dialog, DialogTitle, DialogActions, DialogContent
} from 'react-mdl';

import DataController from './DataController';

//a "root" component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { brands: [], models: [] };
    this.loadBrandsMenu = this.loadBrandsMenu.bind(this);
    this.changeBrand = this.changeBrand.bind(this);
    this.loadBrandsMenu();
  }

  // load all the camera brands from the api into the side menu
  loadBrandsMenu() {
    var thisComponent = this;
    DataController.searchBrands()
      .then(function (data) { //once we get data
        thisComponent.setState({
          brands: data.brands.brand
        })
      });
  }

  // change the current camera brand by reassigning the states
  changeBrand(cameraBrand) {
    var thisComponent = this;
    DataController.searchModels(cameraBrand)
      .then(function (data) { //once we get data
        thisComponent.setState({
          models: data.cameras.camera
        })
      });
  }

  // overall web app structure
  render() {
    return (
      <div>
        <main>
          <div id="overall" style={{ height: document.documentElement.clientHeight - 80 }}>
            <Layout fixedHeader>
              <SearchHeader changeBrandCallback={this.changeBrand} />
              <BrandSelector brands={this.state.brands} changeBrandCallback={this.changeBrand} />
              <CameraGrid models={this.state.models} />
            </Layout>
          </div>
        </main>
        <Footer style={{ textAlign: "center" }} size="mini">
          <p>WeCAM  2016 by Tao Long</p>
        </Footer>
      </div>
    );
  }
}

// constructs the search header
class SearchHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchValue: '' }
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // once new value is searched, call the parent function to change the current brand
  handleSearch() {
    this.props.changeBrandCallback(this.state.searchValue);
  }

  // change the current search value states 
  handleChange() {
    var newValue = document.getElementById("searchBox").value;
    this.setState({ searchValue: newValue });
  }

  render() {
    return (
      <Header title="WeCAM">
        <Textfield id="searchBox"
          aria-label="search bar"
          placeholder="Camera Brand"
          onChange={this.handleChange}
          onClick={this.handleSearch}
          label="Search"
          expandable
          expandableIcon="search"
          />
      </Header>
    );
  }
}

// construct the side menu that contains all camera brands
class BrandSelector extends React.Component {
  render() {
    var changeBrandCallback = this.props.changeBrandCallback;
    var theBrand = this.props.brands.map(function (eachBrand) {
      return <SelectBrand brand={eachBrand.name} key={eachBrand.id} changeBrandCallback={changeBrandCallback} />;
    })

    return (
      <Drawer title="Select a Brand">
        <Navigation aria-label="navigation list">
          {theBrand}
        </Navigation>
      </Drawer>
    );
  }
}

// render each simgle brand in the side menu and update the brand clicked 
class SelectBrand extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // once one of the brand get clicked, call the callback function to update the new brand states
  handleClick() {
    this.props.changeBrandCallback(this.props.brand);
  }

  render() {
    return (
      <Button aria-label="button" primary onClick={this.handleClick}>{this.props.brand}</Button>
    );
  }
}

// construct the grid of different models of cameras
class CameraGrid extends React.Component {
  render() {
    var theModel = this.props.models.map(function (eachModel) {
      return <CameraCard model={eachModel} key={eachModel.id} />;
    })
    return (
      <div id="grid">
        <Grid>
          {theModel}
        </Grid>
      </div>
    );
  }
}

// construct each single card of camera that contains the name and picture 
// and a dialog that shows the details of the camera model
class CameraCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  // call this function to open the dialog
  handleOpenDialog() {
    this.setState({
      openDialog: true
    });
  }

  // call this function to close the dialog
  handleCloseDialog() {
    this.setState({
      openDialog: false
    });
  }

  render() {
    var model = this.props.model;
    var imageLink = DataController.getImage(model);
    var image = 'url("' + DataController.getImage(model) + '")';
    return (
      <Cell className="cell" col={4} tablet={8} phone={12}>
        <div>
          <Card aria-label="camera card" className="card" shadow={4}>
            <CardTitle expand style={{ background: image + 'no-repeat 50%' }}></CardTitle>
            <CardText>
              {model.name._content}
            </CardText>
            <CardActions border>
              <Button onClick={this.handleOpenDialog} raised ripple>Details</Button>
            </CardActions>
          </Card>
        </div>
        <Dialog aria-label="pop up dialog" className="dialog" open={this.state.openDialog}>
          <DialogTitle id="dialogTitle">{model.name._content}</DialogTitle>
          <DialogContent id="diaContent">
            <img src={imageLink} alt={model.name_content}></img>
            <p>{DataController.getLcdSize(model)}</p>
            <p>{DataController.getMegaPixel(model)}</p>
            <p>{DataController.getMemoryType(model)}</p>
          </DialogContent>
          <Button mini aria-label="button" id="dismissButton" type='button' raised ripple onClick={this.handleCloseDialog}>Dismiss</Button>
        </Dialog>
      </Cell>
    );
  }
}

export default App; //make this class available to other files 