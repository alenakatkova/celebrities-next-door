import React, { Component } from "react";
import Map from "ol/Map";
import Request from "./Request";
import OlView from "ol/View";
import {Tile as OlLayerTile, Vector as VectorLayer} from 'ol/layer';
import OlSourceOSM from "ol/source/OSM";
import {toLonLat} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import "ol/ol.css";

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import {Icon, Style} from 'ol/style';

import {defaults as defaultControls} from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';

class PublicMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 46,
      long: 6.5,
      pins: [new Feature({
        geometry: new Point(fromLonLat([12.5, 41.9]))
      })],

      data: [],
      query: undefined,
      latFromRequest: 0
    };
    this.handleLatChange = this.handleLatChange.bind(this);
    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: null,
      undefinedHTML: '&nbsp;'
    });

    this.state.pins.forEach((item) => {
          console.log(item);
          item.setStyle(new Style({
            image: new Icon({
              crossOrigin: 'anonymous',
              src: './pin.svg'
            })
          }))
        }

    );

    this.vectorSource = new VectorSource({
      features: this.state.pins
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.olmap = new Map({
      controls: defaultControls().extend([this.mousePositionControl]),
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        }), this.vectorLayer
      ],
      view: new OlView({
        center: [0, 0],
        zoom: 1
      })
    });
  }
  handleLatChange(latt) {
   // this.setState({latt});
    this.setState(prevState =>{
      return{
        ...prevState,
        latFromRequest : latt
      }
    })
  }
  updateVectorLayer() {
  }

  updateMap() {

  }

  componentDidMount() {
    this.olmap.setTarget("map");
    this.mousePositionControl.setTarget("mouse");

    this.olmap.on('click', (evt) => {
      let coordinate = evt.coordinate;
      let hdms = toLonLat(coordinate);

      var feature = this.olmap.forEachFeatureAtPixel(evt.pixel,
          function(feature) {
            return feature;
          });
      if (feature) {
        console.log("hit pin");
      } else {
        this.setState({lat: hdms[1], long: hdms[0]})

        let newPin = new Feature({
          geometry: new Point(fromLonLat([hdms[0], hdms[1]]))
        });
        newPin.setStyle(new Style({
          image: new Icon({
            crossOrigin: 'anonymous',
            src: './pin.svg'
          })
        }));
        this.setState({
          pins: [ ...this.state.pins, newPin]
        }, () => this.vectorSource.addFeature(newPin))
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.updateVectorLayer();
    return (this.state.pins.length < nextState.pins.length);
  }


  render() {
    this.updateMap(); // Update map on render?
    return (
        <div>
          <div id="mouse"></div>
          <div id="map" style={{ width: "100%", height: "360px", marginBottom: "40px" }}>

          </div>
          <Request lat={this.state.lat} long={this.state.long} onLatChange={this.handleLatChange}/>
        </div>
    );
  }
}

export default PublicMap;
