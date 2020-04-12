import React, { Component } from "react";
import Map from "ol/Map";
import Request from "./Request";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import {toLonLat} from 'ol/proj';
import "ol/ol.css";

import {defaults as defaultControls} from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';

class PublicMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //center: [0, 0],
      //zoom: 1,
      lat: 46,
      long: 6.5
    };

    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: null,
      undefinedHTML: '&nbsp;'
    });

    this.olmap = new Map({
      controls: defaultControls().extend([this.mousePositionControl]),
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        })
      ],
      // view: new OlView({
      //   center: this.state.center,
      //   zoom: this.state.zoom
      // }),
      view: new OlView({
        center: [0, 0],
        zoom: 1
      })
    });
  }

  // updateMap() {
  //   this.olmap.getView().setCenter(this.state.center);
  //   this.olmap.getView().setZoom(this.state.zoom);
  // }

  componentDidMount() {
    this.olmap.setTarget("map");
    this.mousePositionControl.setTarget("mouse");

    this.olmap.on('singleclick', (evt) => {
      let coordinate = evt.coordinate;
      let hdms = toLonLat(coordinate);
      this.setState({lat: hdms[1], long: hdms[0]})
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // let center = this.olmap.getView().getCenter();
    // let zoom = this.olmap.getView().getZoom();
    console.log(this.state.lat !== nextState.lat);
    return (this.state.lat !== nextState.lat);
  }
  //
  // userAction() {
  //   this.setState({ center: [546000, 6868000], zoom: 5 });
  // }

  render() {
    // this.updateMap(); // Update map on render?
    return (
        <div>
          <div id="mouse"></div>
          <div id="map" style={{ width: "100%", height: "360px", marginBottom: "40px" }}>

          </div>
          <Request lat={this.state.lat} long={this.state.long}/>
        </div>
    );
  }
}

export default PublicMap;
