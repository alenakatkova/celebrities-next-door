import React, { Component } from "react";
import Map from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import {toStringHDMS} from 'ol/coordinate';
import {toLonLat} from 'ol/proj';
import {transform} from 'ol/proj';
import "ol/ol.css";

import {defaults as defaultControls} from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';

class PublicMap extends Component {
  constructor(props) {
    super(props);

    this.state = { center: [0, 0], zoom: 1 };

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
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  componentDidMount() {
    this.olmap.setTarget("map");
    this.mousePositionControl.setTarget("mouse");

    // Listen to map changes
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });

    this.olmap.on('singleclick', function(evt) {
      let coordinate = evt.coordinate;
      let hdms = toLonLat(coordinate);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    return !(center === nextState.center && zoom === nextState.zoom);

  }

  userAction() {
    this.setState({ center: [546000, 6868000], zoom: 5 });
  }

  render() {
    this.updateMap(); // Update map on render?
    return (
        <div>
        <div id="mouse"></div>
        <div id="map" style={{ width: "100%", height: "360px" }}>
          <button onClick={e => this.userAction()}>setState on click</button>
        </div></div>
    );
  }
}

export default PublicMap;
