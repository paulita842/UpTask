import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, FlatList, NativeBaseProvider} from 'native-base';

import {useNavigation} from '@react-navigation/native';

import globalStyles from '../styles/globalStyles';
import {gql, useQuery} from '@apollo/client';

const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

const Proyectos = () => {
  //navegación
  const navigation = useNavigation();

  //APOLLO

  const {data, loading, error} = useQuery(OBTENER_PROYECTOS);

  const renderItem = ({item}) => {
    const handlePress = () => {
      navigation.navigate('Proyecto', {proyecto: item});
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.contenido}>
          <Text>{item.nombre}</Text>
          <View style={styles.separator} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <NativeBaseProvider>
      <View
        style={[
          globalStyles.contenedor,
          {backgroundColor: '#e84347' || undefined},
        ]}>
        <Button
          square
          block
          backgroundColor={'#28303b'}
          marginTop={30}
          onPress={() => navigation.navigate('NuevoProyecto')}>
          <Text textTransform={'uppercase'} bold color={'#fff'}>
            Nuevo Proyecto
          </Text>
        </Button>
        <Text fontSize={'xl'} bold style={globalStyles.subtitulo}>
          Selecciona un Proyecto
        </Text>
        <View>
          <FlatList
            data={data?.obtenerProyectos || []}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#fff',
    marginHorizontal: '2,5%',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
  },
  text: {
    marginLeft: 15,
  },
});

export default Proyectos;
