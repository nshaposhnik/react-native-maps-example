import _ from 'lodash';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapsViewHeader from './MapsViewHeader';

function MapsView(props) {
  const API_KEY = 'YOUR_API_KEY';
  const { width, height } = Dimensions.get('window');
  const mapView = useRef();
  const [coordinates, setCoordinates] = useState([
    {
      latitude: 37.3317876,
      longitude: -122.0054812,
    },
    {
      latitude: 37.771707,
      longitude: -122.4053769
    },
  ]);

  const changeCoordinates = (waypoints) => {
    const res = [];
    _.forEach(waypoints, waypoint => {
      if (waypoint.geometry && waypoint.geometry.location) {
        res.push({
          latitude: waypoint.geometry.location.lat,
          longitude: waypoint.geometry.location.lng,
        });
      }
    });
    setCoordinates(res);
  };

  return (
    <View style={styles.container}>
      <MapsViewHeader onChange={(waypoints) => changeCoordinates(waypoints)} navigation={props.navigation} />
      <MapView 
        style={{flex: 1, width: '100%'}}
        ref={mapView}>
        {coordinates.map((coordinate, index) =><MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} /> )}
        <MapViewDirections
          apikey={API_KEY}
          origin={coordinates[0]}
          waypoints={coordinates}
          destination={coordinates[coordinates.length - 1]}
          strokeWidth={3}
          strokeColor="hotpink"
          optimizeWaypoints
          onStart={(params) => {
            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={result => {
            console.log(`routing complete, distance is: ${result.distance}`);
            mapView.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: (width / 20),
                bottom: (height / 20),
                left: (width / 20),
                top: (height / 20),
              }
            });
          }}
          onError={(errorMessage) => {
           console.log(`GOT AN ERROR: ${errorMessage}`);
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});

export default MapsView;
