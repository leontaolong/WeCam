// This is the data controller of the app: it gets the data requests from 
// the viewer and obtains the data from the api via specifically formed urls

var apiKey = "55f179bb2c12a1e5b3c5938f689986d0";
var baseApiUrl = "https://api.flickr.com/services/rest/?";
var getBrands = "flickr.cameras.getBrands";
var getModels = "flickr.cameras.getBrandModels";
var middleUrl = "&format=json&nojsoncallback=1";

var controller = {

  // download all the camera brands from the url
  searchBrands: function () {
    // construct URL
    var uri = baseApiUrl + "method=" + getBrands + '&api_key=' 
      + apiKey + middleUrl;
    return fetch(uri) //download the data
      .then(function (res) {
        return res.json();
      });
  },

  // takes in a camera brand and 
  // download all the camera models of that brand from the url
  searchModels: function (searchBrand) {
    //construct URL
    var uri = baseApiUrl + "method=" + getModels + '&api_key=' 
      + apiKey + "&brand=" + searchBrand + middleUrl;
    return fetch(uri) //download the data
      .then(function (res) { return res.json(); })
  },

  // takes in a camera model and returns the url of the image of that camera
  getImage: function (model) { 
    if (model.images !== undefined && model.images.large !== undefined) 
      // if the api has an image of this camera model
      return model.images.large._content;
    else 
      return 'https://icons.iconarchive.com/icons/graphicloads/100-flat/128/camera-icon.png'; //load the camera icon
  },

  // takes in a camera model and returns LCD Screen Size of that model
  getLcdSize: function (model) {
    var result = 'LCD Screen Size: ';
    if (model.details !== undefined && model.details.lcd_screen_size !== undefined) 
      // if the api has this information about the camera model
      result += model.details.lcd_screen_size._content;
    else 
      result += "unavailable"
    return result;
  },

  // takes in a camera model and returns the megapixels of that model
  getMegaPixel: function (model) {
    var result = 'Megapixels: ';
    if (model.details !== undefined && model.details.megapixels !== undefined) 
      // if the api has this information about the camera model
      result += model.details.megapixels._content;
    else 
      result += "unavailable"
    return result;
  },

  // takes in a camera model and returns the memory type of that model
  getMemoryType: function (model) {
    var result = 'Memory Type: ';
    if (model.details !== undefined && model.details.memory_type !== undefined) 
      // if the api has this information about the camera model
      result += model.details.memory_type._content;
    else 
      result += "unavailable"
    return result;
  }
};

export default controller; //export object