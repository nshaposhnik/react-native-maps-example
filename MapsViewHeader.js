import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Dimensions, TextInput, Text, View, VirtualizedList, UIManager, LayoutAnimation, TouchableOpacity, Image } from "react-native";
import { SwipeRow } from 'react-native-swipe-list-view';
import PropTypes from 'prop-types';

function MapsViewHeader(props) {
  const MAX_WAYPOINTS = 10;

  const createNewWaypoint = (id, label) => (
    { id, value: '', label }
  );

  const [waypoints, setWaypoints] = useState({ 0: createNewWaypoint(0, 'From'), 1: createNewWaypoint(1, 'To') });

  useEffect(() => {
    //use this for nice animations of addition/removal of the row. Feel free to remove it and LayoutAnimation usage if you don't need it.
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  useEffect(() => {
    props.onChange(waypoints);
  }, [waypoints]);

  const editField = (id, str, geometry) => {
    const waypoint = _.cloneDeep(waypoints[id]);
    waypoint.value = str;
    waypoint.geometry = geometry;
    setWaypoints({ ...waypoints, [id]: waypoint });
  };

  const canDeleteRows = () => (_.size(waypoints) > 2);

  const removeField = (item) => {
    if (canDeleteRows()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWaypoints(_.omit(waypoints, item.id));
    }
  };

  const uniqueId = () => (Math.max(..._.keys(waypoints).map(Number)) + 1);

  const addField = () => {
    if (_.size(waypoints) < MAX_WAYPOINTS) {
      const anim = { duration: 700, update: { type: 'spring', springDamping: 0.4 }, delete: { type: 'linear', property: 'opacity' } };
      LayoutAnimation.configureNext(anim);
      const id = uniqueId();
      setWaypoints({ ...waypoints, [id]: createNewWaypoint(id, 'To') });
    }
  };

  const renderFieldItem = (item) => {
    const { id, name, label, value } = item;
    return (
      <TextInput
        placeholder={label}
        style={{ paddingTop: 15, paddingBottom: 15, backgroundColor:'white' }}
        onFocus={() => props.navigation.navigate('PlacesInput', {id, onPlaceChosen: editField})}>
          {value}
      </TextInput>
    );
  }

  const renderField = (item) => {
    return (
      <SwipeRow
        style={styles.swipeRow}
        rightOpenValue={-75}
        stopRightSwipe={-75}
        disableRightSwipe
        disableLeftSwipe={!canDeleteRows()}
      >
        <TouchableOpacity style={styles.removeButton} onPress={() => removeField(item)}>
          <Image source={require('./icon-trash.png')} style={{ width: 20, height: 25 }} />
        </TouchableOpacity>
        {renderFieldItem(item)}
      </SwipeRow>
    );
  }

  const renderAddAnotherField = () => (
    <View style={styles.addAnotherContainer}>
      <TouchableOpacity onPress={() => addField()}>
        <Text style={styles.label}>Add another waypoint</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container} >
      <VirtualizedList
        data={_.values(waypoints)}
        keyExtractor={item => item.id.toString()}
        getItem={(data, index) => data[index]}
        getItemCount={data => data.length}
        renderItem={({ item }) => (renderField(item))}
      />
      {renderAddAnotherField()}
    </View>
  );
}

const styles = {
  swipeRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    fontSize: 15,
    padding: 5,
    color: '#8C8C8C',
  },
  container: {
    maxHeight: Dimensions.get('window').height / 2.3,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10
  },
  addAnotherContainer: {
    flexDirection: 'row-reverse',
    marginRight: 15
  },
  removeButton: {
    position: 'absolute',
    left: 20,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 28,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
};

export default MapsViewHeader;
